/**
 * Copyright © 2023-2030 The ruanrongman Authors
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package top.rslly.iot.controllers;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import top.rslly.iot.models.WxProductActiveEntity;
import top.rslly.iot.models.WxUserEntity;
import top.rslly.iot.param.request.WxActiveProduct;
import top.rslly.iot.param.request.WxChatRequest;
import top.rslly.iot.param.response.WxChatResponse;
import top.rslly.iot.services.iot.AlarmEventServiceImpl;
import top.rslly.iot.services.knowledgeGraphic.KnowledgeGraphicService;
import top.rslly.iot.services.thingsModel.*;
import top.rslly.iot.param.request.KnowledgeGraphicNode;
import top.rslly.iot.param.request.KnowledgeGraphicRelation;
import top.rslly.iot.param.request.KnowledgeGraphicAttribute;
import top.rslly.iot.services.wechat.WxProductActiveServiceImpl;
import top.rslly.iot.services.wechat.WxProductBindServiceImpl;
import top.rslly.iot.services.wechat.WxUserServiceImpl;
import top.rslly.iot.services.storage.DataServiceImpl;
import top.rslly.iot.utility.JwtTokenUtil;
import top.rslly.iot.utility.ai.chain.Router;
import top.rslly.iot.utility.result.JsonResult;
import top.rslly.iot.utility.result.ResultCode;
import top.rslly.iot.utility.result.ResultTool;

import jakarta.validation.Valid;
import java.util.List;

/**
 * WeChat Mini Program API controller. All endpoints require a valid ROLE_wx_user JWT and operate
 * within the security boundary of the user's bound products.
 */
@RestController
@RequestMapping(value = "/api/wx/v1")
@Validated
@Slf4j
public class WxMini {

  @Autowired
  private WxUserServiceImpl wxUserService;
  @Autowired
  private WxProductBindServiceImpl wxProductBindService;
  @Autowired
  private WxProductActiveServiceImpl wxProductActiveService;
  @Autowired
  private ProductServiceImpl productService;
  @Autowired
  private ProductModelServiceImpl productModelService;
  @Autowired
  private ProductDeviceServiceImpl productDeviceService;
  @Autowired
  private ProductDataServiceImpl productDataService;
  @Autowired
  private EventDataServiceImpl eventDataService;
  @Autowired
  private AlarmEventServiceImpl alarmEventService;
  @Autowired
  private DataServiceImpl dataService;
  @Autowired
  private Router router;
  @Autowired
  private KnowledgeGraphicService knowledgeGraphicService;

  @Value("${wx.micro.appid}")
  private String microAppid;

  // ─────────────────────────────────────────────
  // Helper: resolve WxUserEntity from JWT or return null
  // ─────────────────────────────────────────────
  private WxUserEntity resolveWxUser(String header) {
    if (header == null || !header.startsWith(JwtTokenUtil.TOKEN_PREFIX)) {
      return null;
    }
    String token = header.replace(JwtTokenUtil.TOKEN_PREFIX, "");
    if (JwtTokenUtil.checkJWT(token) == null) {
      return null;
    }
    String role = JwtTokenUtil.getUserRole(token);
    if (!role.equals("ROLE_wx_user")) {
      return null;
    }
    String username = JwtTokenUtil.getUsername(token);
    List<WxUserEntity> users = wxUserService.findAllByName(username);
    if (users.isEmpty()) {
      return null;
    }
    return users.get(0);
  }

  // ─────────────────────────────────────────────
  // 1. GET /wxMyProducts — list all bound products
  // ─────────────────────────────────────────────
  @RequestMapping(value = "/wxMyProducts", method = RequestMethod.GET)
  public JsonResult<?> wxMyProducts(@RequestHeader("Authorization") String header) {
    return wxProductBindService.wxGetBindProduct(header);
  }

  // ─────────────────────────────────────────────
  // 2. GET /wxActiveProduct — get currently active product
  // ─────────────────────────────────────────────
  @RequestMapping(value = "/wxActiveProduct", method = RequestMethod.GET)
  public JsonResult<?> getWxActiveProduct(@RequestHeader("Authorization") String header) {
    WxUserEntity user = resolveWxUser(header);
    if (user == null) {
      return ResultTool.fail(ResultCode.USER_ACCOUNT_NOT_EXIST);
    }
    var activeList = wxProductActiveService.findAllByAppidAndOpenid(user.getAppid(), user.getOpenid());
    if (activeList.isEmpty()) {
      return ResultTool.fail(ResultCode.PARAM_NOT_VALID);
    }
    return ResultTool.success(activeList.get(0));
  }

  // ─────────────────────────────────────────────
  // 3. POST /wxActiveProduct — set active product
  // ─────────────────────────────────────────────
  @RequestMapping(value = "/wxActiveProduct", method = RequestMethod.POST)
  public JsonResult<?> setWxActiveProduct(@Valid @RequestBody WxActiveProduct wxActiveProduct,
      @RequestHeader("Authorization") String header) {
    WxUserEntity user = resolveWxUser(header);
    if (user == null) {
      return ResultTool.fail(ResultCode.USER_ACCOUNT_NOT_EXIST);
    }
    int productId = wxActiveProduct.getProductId();
    // Enforce security: product must be bound to this user
    if (wxProductBindService.findByAppidAndOpenidAndProductId(user.getAppid(), user.getOpenid(),
        productId).isEmpty()) {
      return ResultTool.fail(ResultCode.NO_PERMISSION);
    }
    WxProductActiveEntity entity = new WxProductActiveEntity();
    entity.setAppid(user.getAppid());
    entity.setOpenid(user.getOpenid());
    entity.setProductId(productId);
    wxProductActiveService.setUp(entity);
    return ResultTool.success();
  }

  // ─────────────────────────────────────────────
  // 4. GET /wxProductInfo — basic product info for active product
  // ─────────────────────────────────────────────
  @RequestMapping(value = "/wxProductInfo", method = RequestMethod.GET)
  public JsonResult<?> wxProductInfo(@RequestHeader("Authorization") String header) {
    WxUserEntity user = resolveWxUser(header);
    if (user == null) {
      return ResultTool.fail(ResultCode.USER_ACCOUNT_NOT_EXIST);
    }
    var activeList = wxProductActiveService.findAllByAppidAndOpenid(user.getAppid(), user.getOpenid());
    if (activeList.isEmpty()) {
      return ResultTool.fail(ResultCode.PARAM_NOT_VALID);
    }
    int productId = activeList.get(0).getProductId();
    var productList = productService.findAllById(productId);
    if (productList.isEmpty()) {
      return ResultTool.fail(ResultCode.PARAM_NOT_VALID);
    }
    return ResultTool.success(productList.get(0));
  }

  // ─────────────────────────────────────────────
  // 5. GET /wxProductModel — thing model for active product
  // ─────────────────────────────────────────────
  @RequestMapping(value = "/wxProductModel", method = RequestMethod.GET)
  public JsonResult<?> wxProductModel(@RequestHeader("Authorization") String header) {
    WxUserEntity user = resolveWxUser(header);
    if (user == null) {
      return ResultTool.fail(ResultCode.USER_ACCOUNT_NOT_EXIST);
    }
    var activeList = wxProductActiveService.findAllByAppidAndOpenid(user.getAppid(), user.getOpenid());
    if (activeList.isEmpty()) {
      return ResultTool.fail(ResultCode.PARAM_NOT_VALID);
    }
    int productId = activeList.get(0).getProductId();
    // Enforce security boundary
    if (wxProductBindService.findByAppidAndOpenidAndProductId(user.getAppid(), user.getOpenid(),
        productId).isEmpty()) {
      return ResultTool.fail(ResultCode.NO_PERMISSION);
    }
    return productModelService.getProductModel(productId);
  }

  // ─────────────────────────────────────────────
  // 6. GET /wxProductDevices — devices for active product
  // ─────────────────────────────────────────────
  @RequestMapping(value = "/wxProductDevices", method = RequestMethod.GET)
  public JsonResult<?> wxProductDevices(@RequestHeader("Authorization") String header) {
    WxUserEntity user = resolveWxUser(header);
    if (user == null) {
      return ResultTool.fail(ResultCode.USER_ACCOUNT_NOT_EXIST);
    }
    var activeList = wxProductActiveService.findAllByAppidAndOpenid(user.getAppid(), user.getOpenid());
    if (activeList.isEmpty()) {
      return ResultTool.fail(ResultCode.PARAM_NOT_VALID);
    }
    int productId = activeList.get(0).getProductId();
    if (wxProductBindService.findByAppidAndOpenidAndProductId(user.getAppid(), user.getOpenid(),
        productId).isEmpty()) {
      return ResultTool.fail(ResultCode.NO_PERMISSION);
    }
    var models = productModelService.findAllByProductId(productId);
    if (models.isEmpty()) {
      return ResultTool.fail(ResultCode.PARAM_NOT_VALID);
    }
    var devices = new java.util.ArrayList<>();
    for (var model : models) {
      devices.addAll(productDeviceService.findAllByModelId(model.getId()));
    }
    if (devices.isEmpty()) {
      return ResultTool.fail(ResultCode.PARAM_NOT_VALID);
    }
    return ResultTool.success(devices);
  }

  // ─────────────────────────────────────────────
  // 7. GET /wxDeviceData — historical property data for a device
  //    Params: deviceName, jsonKey, time1 (epoch ms), time2 (epoch ms)
  // ─────────────────────────────────────────────
  @RequestMapping(value = "/wxDeviceData", method = RequestMethod.GET)
  public JsonResult<?> wxDeviceData(
      @RequestParam("deviceName") String deviceName,
      @RequestParam("jsonKey") String jsonKey,
      @RequestParam("time1") long time1,
      @RequestParam("time2") long time2,
      @RequestHeader("Authorization") String header) {
    WxUserEntity user = resolveWxUser(header);
    if (user == null) {
      return ResultTool.fail(ResultCode.USER_ACCOUNT_NOT_EXIST);
    }
    // Security: verify device belongs to a product bound to this user
    var deviceList = productDeviceService.findAllByName(deviceName);
    if (deviceList.isEmpty()) {
      return ResultTool.fail(ResultCode.PARAM_NOT_VALID);
    }
    int modelId = deviceList.get(0).getModelId();
    var modelList = productModelService.findAllById(modelId);
    if (modelList.isEmpty()) {
      return ResultTool.fail(ResultCode.PARAM_NOT_VALID);
    }
    int productId = modelList.get(0).getProductId();
    if (wxProductBindService.findByAppidAndOpenidAndProductId(user.getAppid(), user.getOpenid(),
        productId).isEmpty()) {
      return ResultTool.fail(ResultCode.NO_PERMISSION);
    }
    return dataService.findAllByTimeBetweenAndDeviceNameAndJsonKey(time1, time2, deviceName,
        jsonKey);
  }

  // ─────────────────────────────────────────────
  // 8. GET /wxEventData — event data schema for active product
  // ─────────────────────────────────────────────
  @RequestMapping(value = "/wxEventData", method = RequestMethod.GET)
  public JsonResult<?> wxEventData(@RequestHeader("Authorization") String header) {
    WxUserEntity user = resolveWxUser(header);
    if (user == null) {
      return ResultTool.fail(ResultCode.USER_ACCOUNT_NOT_EXIST);
    }
    // getEventData already filters by user's bound products for wx_user role
    return eventDataService.getEventData(header);
  }

  // ─────────────────────────────────────────────
  // 9. GET /wxAlarmEvents — alarm events for user's bound products
  // ─────────────────────────────────────────────
  @RequestMapping(value = "/wxAlarmEvents", method = RequestMethod.GET)
  public JsonResult<?> wxAlarmEvents(@RequestHeader("Authorization") String header) {
    WxUserEntity user = resolveWxUser(header);
    if (user == null) {
      return ResultTool.fail(ResultCode.USER_ACCOUNT_NOT_EXIST);
    }
    // getAlarmEvent already filters by user's bound products for wx_user role
    return alarmEventService.getAlarmEvent(header);
  }

  // ─────────────────────────────────────────────
  // 10. POST /wxChat — send message to AI agent for active product
  // ─────────────────────────────────────────────
  @RequestMapping(value = "/wxChat", method = RequestMethod.POST)
  public JsonResult<?> wxChat(@Valid @RequestBody WxChatRequest wxChatRequest,
      @RequestHeader("Authorization") String header) {
    WxUserEntity user = resolveWxUser(header);
    if (user == null) {
      return ResultTool.fail(ResultCode.USER_ACCOUNT_NOT_EXIST);
    }
    String openid = user.getOpenid();
    String appid = user.getAppid();
    int productId = 0;
    var activeList = wxProductActiveService.findAllByAppidAndOpenid(appid, openid);
    if (!activeList.isEmpty()) {
      productId = activeList.get(0).getProductId();
    } else {
      var bindList = wxProductBindService.findAllByAppidAndOpenid(appid, openid);
      if (!bindList.isEmpty()) {
        productId = bindList.get(0).getProductId();
      }
    }
    if (productId == 0) {
      return ResultTool.fail(ResultCode.PARAM_NOT_VALID);
    }
    String reply = router.response(wxChatRequest.getMessage(), openid, productId, appid);
    return ResultTool.success(new WxChatResponse(reply));
  }

  // ─────────────────────────────────────────────
  // Knowledge Graph helper: verify active product belongs to wx user
  // ─────────────────────────────────────────────
  private int resolveActiveProductForUser(WxUserEntity user) {
    var activeList =
        wxProductActiveService.findAllByAppidAndOpenid(user.getAppid(), user.getOpenid());
    if (!activeList.isEmpty()) {
      return activeList.get(0).getProductId();
    }
    var bindList = wxProductBindService.findAllByAppidAndOpenid(user.getAppid(), user.getOpenid());
    if (!bindList.isEmpty()) {
      return bindList.get(0).getProductId();
    }
    return 0;
  }

  private boolean userOwnsProduct(WxUserEntity user, int productId) {
    return !wxProductBindService
        .findByAppidAndOpenidAndProductId(user.getAppid(), user.getOpenid(), productId).isEmpty();
  }

  // ─────────────────────────────────────────────
  // 11. GET /kg/graphic — full knowledge graph for active product
  // ─────────────────────────────────────────────
  @RequestMapping(value = "/kg/graphic", method = RequestMethod.GET)
  public JsonResult<?> getKnowledgeGraphic(@RequestHeader("Authorization") String header) {
    WxUserEntity user = resolveWxUser(header);
    if (user == null) {
      return ResultTool.fail(ResultCode.USER_ACCOUNT_NOT_EXIST);
    }
    int productId = resolveActiveProductForUser(user);
    if (productId == 0 || !userOwnsProduct(user, productId)) {
      return ResultTool.fail(ResultCode.NO_PERMISSION);
    }
    return knowledgeGraphicService.getKnowledgeGraphicByProductId(productId);
  }

  // ─────────────────────────────────────────────
  // 12. GET /kg/nodes — all nodes for active product
  // ─────────────────────────────────────────────
  @RequestMapping(value = "/kg/nodes", method = RequestMethod.GET)
  public JsonResult<?> getKgNodes(@RequestHeader("Authorization") String header) {
    WxUserEntity user = resolveWxUser(header);
    if (user == null) {
      return ResultTool.fail(ResultCode.USER_ACCOUNT_NOT_EXIST);
    }
    int productId = resolveActiveProductForUser(user);
    if (productId == 0 || !userOwnsProduct(user, productId)) {
      return ResultTool.fail(ResultCode.NO_PERMISSION);
    }
    return knowledgeGraphicService.getNodes(productId);
  }

  // ─────────────────────────────────────────────
  // 13. GET /kg/node — get a node by name
  // ─────────────────────────────────────────────
  @RequestMapping(value = "/kg/node", method = RequestMethod.GET)
  public JsonResult<?> getKgNode(@RequestParam("name") String name,
      @RequestHeader("Authorization") String header) {
    WxUserEntity user = resolveWxUser(header);
    if (user == null) {
      return ResultTool.fail(ResultCode.USER_ACCOUNT_NOT_EXIST);
    }
    int productId = resolveActiveProductForUser(user);
    if (productId == 0 || !userOwnsProduct(user, productId)) {
      return ResultTool.fail(ResultCode.NO_PERMISSION);
    }
    return knowledgeGraphicService.getNode(name, productId);
  }

  // ─────────────────────────────────────────────
  // 14. POST /kg/node — add a knowledge graph node
  // ─────────────────────────────────────────────
  @RequestMapping(value = "/kg/node", method = RequestMethod.POST)
  public JsonResult<?> addKgNode(@Valid @RequestBody KnowledgeGraphicNode node,
      @RequestHeader("Authorization") String header) {
    WxUserEntity user = resolveWxUser(header);
    if (user == null) {
      return ResultTool.fail(ResultCode.USER_ACCOUNT_NOT_EXIST);
    }
    int productId = resolveActiveProductForUser(user);
    if (productId == 0 || !userOwnsProduct(user, productId)) {
      return ResultTool.fail(ResultCode.NO_PERMISSION);
    }
    node.setProductId(productId);
    return knowledgeGraphicService.addNode(node);
  }

  // ─────────────────────────────────────────────
  // 15. PUT /kg/node — update a knowledge graph node
  // ─────────────────────────────────────────────
  @RequestMapping(value = "/kg/node", method = RequestMethod.PUT)
  public JsonResult<?> updateKgNode(@RequestBody KnowledgeGraphicNode node,
      @RequestHeader("Authorization") String header) {
    WxUserEntity user = resolveWxUser(header);
    if (user == null) {
      return ResultTool.fail(ResultCode.USER_ACCOUNT_NOT_EXIST);
    }
    int productId = resolveActiveProductForUser(user);
    if (productId == 0 || !userOwnsProduct(user, productId)) {
      return ResultTool.fail(ResultCode.NO_PERMISSION);
    }
    node.setProductId(productId);
    return knowledgeGraphicService.updateNode(node);
  }

  // ─────────────────────────────────────────────
  // 16. DELETE /kg/node — delete a knowledge graph node by id
  // ─────────────────────────────────────────────
  @RequestMapping(value = "/kg/node", method = RequestMethod.DELETE)
  public JsonResult<?> deleteKgNode(@Valid @RequestBody KnowledgeGraphicNode node,
      @RequestHeader("Authorization") String header) {
    WxUserEntity user = resolveWxUser(header);
    if (user == null) {
      return ResultTool.fail(ResultCode.USER_ACCOUNT_NOT_EXIST);
    }
    int productId = resolveActiveProductForUser(user);
    if (productId == 0 || !userOwnsProduct(user, productId)) {
      return ResultTool.fail(ResultCode.NO_PERMISSION);
    }
    return knowledgeGraphicService.deleteNode(node.id);
  }

  // ─────────────────────────────────────────────
  // 17. GET /kg/attr — get attributes for a node
  // ─────────────────────────────────────────────
  @RequestMapping(value = "/kg/attr", method = RequestMethod.GET)
  public JsonResult<?> getKgAttributes(@RequestParam("nodeId") long nodeId,
      @RequestHeader("Authorization") String header) {
    WxUserEntity user = resolveWxUser(header);
    if (user == null) {
      return ResultTool.fail(ResultCode.USER_ACCOUNT_NOT_EXIST);
    }
    int productId = resolveActiveProductForUser(user);
    if (productId == 0 || !userOwnsProduct(user, productId)) {
      return ResultTool.fail(ResultCode.NO_PERMISSION);
    }
    return knowledgeGraphicService.getAttributes(nodeId);
  }

  // ─────────────────────────────────────────────
  // 18. POST /kg/attr — add attribute to a node
  // ─────────────────────────────────────────────
  @RequestMapping(value = "/kg/attr", method = RequestMethod.POST)
  public JsonResult<?> addKgAttribute(@Valid @RequestBody KnowledgeGraphicAttribute attribute,
      @RequestHeader("Authorization") String header) {
    WxUserEntity user = resolveWxUser(header);
    if (user == null) {
      return ResultTool.fail(ResultCode.USER_ACCOUNT_NOT_EXIST);
    }
    int productId = resolveActiveProductForUser(user);
    if (productId == 0 || !userOwnsProduct(user, productId)) {
      return ResultTool.fail(ResultCode.NO_PERMISSION);
    }
    attribute.setProductId(productId);
    return knowledgeGraphicService.addAttribute(attribute);
  }

  // ─────────────────────────────────────────────
  // 19. DELETE /kg/attr — delete an attribute
  // ─────────────────────────────────────────────
  @RequestMapping(value = "/kg/attr", method = RequestMethod.DELETE)
  public JsonResult<?> deleteKgAttribute(@RequestBody KnowledgeGraphicAttribute attribute,
      @RequestHeader("Authorization") String header) {
    WxUserEntity user = resolveWxUser(header);
    if (user == null) {
      return ResultTool.fail(ResultCode.USER_ACCOUNT_NOT_EXIST);
    }
    int productId = resolveActiveProductForUser(user);
    if (productId == 0 || !userOwnsProduct(user, productId)) {
      return ResultTool.fail(ResultCode.NO_PERMISSION);
    }
    attribute.setProductId(productId);
    return knowledgeGraphicService.deleteAttribute(attribute);
  }

  // ─────────────────────────────────────────────
  // 20. PUT /kg/attr — update an attribute name
  // ─────────────────────────────────────────────
  @RequestMapping(value = "/kg/attr", method = RequestMethod.PUT)
  public JsonResult<?> updateKgAttribute(@Valid @RequestBody KnowledgeGraphicAttribute attribute,
      @RequestHeader("Authorization") String header) {
    WxUserEntity user = resolveWxUser(header);
    if (user == null) {
      return ResultTool.fail(ResultCode.USER_ACCOUNT_NOT_EXIST);
    }
    int productId = resolveActiveProductForUser(user);
    if (productId == 0 || !userOwnsProduct(user, productId)) {
      return ResultTool.fail(ResultCode.NO_PERMISSION);
    }
    return knowledgeGraphicService.updateAttribute(attribute.name, attribute.id);
  }

  // ─────────────────────────────────────────────
  // 21. GET /kg/relation — get relations for a node
  // ─────────────────────────────────────────────
  @RequestMapping(value = "/kg/relation", method = RequestMethod.GET)
  public JsonResult<?> getKgRelations(@RequestParam("nodeId") long nodeId,
      @RequestHeader("Authorization") String header) {
    WxUserEntity user = resolveWxUser(header);
    if (user == null) {
      return ResultTool.fail(ResultCode.USER_ACCOUNT_NOT_EXIST);
    }
    int productId = resolveActiveProductForUser(user);
    if (productId == 0 || !userOwnsProduct(user, productId)) {
      return ResultTool.fail(ResultCode.NO_PERMISSION);
    }
    return knowledgeGraphicService.getNodeRelations(nodeId);
  }

  // ─────────────────────────────────────────────
  // 22. POST /kg/relation — add a relation
  // ─────────────────────────────────────────────
  @RequestMapping(value = "/kg/relation", method = RequestMethod.POST)
  public JsonResult<?> addKgRelation(@Valid @RequestBody KnowledgeGraphicRelation relation,
      @RequestHeader("Authorization") String header) {
    WxUserEntity user = resolveWxUser(header);
    if (user == null) {
      return ResultTool.fail(ResultCode.USER_ACCOUNT_NOT_EXIST);
    }
    int productId = resolveActiveProductForUser(user);
    if (productId == 0 || !userOwnsProduct(user, productId)) {
      return ResultTool.fail(ResultCode.NO_PERMISSION);
    }
    relation.setProductId(productId);
    return knowledgeGraphicService.addRelation(relation);
  }

  // ─────────────────────────────────────────────
  // 23. DELETE /kg/relation — delete a relation by from/to nodes
  // ─────────────────────────────────────────────
  @RequestMapping(value = "/kg/relation", method = RequestMethod.DELETE)
  public JsonResult<?> deleteKgRelation(@RequestBody KnowledgeGraphicRelation relation,
      @RequestHeader("Authorization") String header) {
    WxUserEntity user = resolveWxUser(header);
    if (user == null) {
      return ResultTool.fail(ResultCode.USER_ACCOUNT_NOT_EXIST);
    }
    int productId = resolveActiveProductForUser(user);
    if (productId == 0 || !userOwnsProduct(user, productId)) {
      return ResultTool.fail(ResultCode.NO_PERMISSION);
    }
    return knowledgeGraphicService.deleteRelationByFromAndTo(relation.from, relation.to);
  }

  // ─────────────────────────────────────────────
  // 24. PUT /kg/relation — update a relation description
  // ─────────────────────────────────────────────
  @RequestMapping(value = "/kg/relation", method = RequestMethod.PUT)
  public JsonResult<?> updateKgRelation(@RequestBody KnowledgeGraphicRelation relation,
      @RequestHeader("Authorization") String header) {
    WxUserEntity user = resolveWxUser(header);
    if (user == null) {
      return ResultTool.fail(ResultCode.USER_ACCOUNT_NOT_EXIST);
    }
    int productId = resolveActiveProductForUser(user);
    if (productId == 0 || !userOwnsProduct(user, productId)) {
      return ResultTool.fail(ResultCode.NO_PERMISSION);
    }
    relation.setProductId(productId);
    return knowledgeGraphicService.updateRelation(relation);
  }
}
