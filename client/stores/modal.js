const modal = {
  namespace: 'modal',
  state: {
    show: false,
    closeOnBgClick: false,
    component: '',
    props: {}
  },
  mutations: {
    openModal: function (state, {component, props, closeOnBgClick}) {
      state.show = true
      state.component = component
      state.props = props
      state.closeOnBgClick = closeOnBgClick
    },
    closeModal: function (state) {
      state.show = false
    }
  }
}

module.exports = modal
