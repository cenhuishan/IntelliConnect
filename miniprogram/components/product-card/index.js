Component({
  properties: {
    product: { type: Object, value: {} },
    active: { type: Boolean, value: false },
  },
  methods: {
    onTap() {
      this.triggerEvent('select', { productId: this.properties.product.id })
    },
  },
})
