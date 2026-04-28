Component({
  properties: {
    device: { type: Object, value: {} },
  },
  methods: {
    onTap() {
      this.triggerEvent('tap', { deviceName: this.properties.device.name })
    },
  },
})
