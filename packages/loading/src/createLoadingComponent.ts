import { createVNode, h, reactive, ref, render, toRefs, Transition, VNode, vShow, withCtx, withDirectives, defineComponent } from 'vue'
import { removeClass } from '@element-plus/utils/dom'
import Empty from '@element-plus/empty'
import type { ILoadingCreateComponentParams, ILoadingInstance } from './loading.type'

export function createLoadingComponent({
  options,
  globalLoadingOption,
}: ILoadingCreateComponentParams): ILoadingInstance {
  let vm: VNode = null
  let afterLeaveTimer: Nullable<number> = null

  const afterLeaveFlag = ref(false)
  const data = reactive({
    ...options,
    originalPosition: '',
    originalOverflow: '',
    visible: false,
  })

  function setText(text: string) {
    data.text = text
  }

  function destroySelf() {
    const target = data.parent
    if (!target.vLoadingAddClassList) {
      let loadingNumber: number | string = target.getAttribute('loading-number')
      loadingNumber = Number.parseInt(loadingNumber) - 1
      if (!loadingNumber) {
        removeClass(target, 'el-loading-parent--relative')
        target.removeAttribute('loading-number')
      } else {
        target.setAttribute('loading-number', loadingNumber.toString())
      }
      removeClass(target, 'el-loading-parent--hidden')
    }
    if (vm.el && vm.el.parentNode) {
      vm.el.parentNode.removeChild(vm.el)
    }
  }

  function close() {
    const target = data.parent
    target.vLoadingAddClassList = null
    if (data.fullscreen) {
      globalLoadingOption.fullscreenLoading = undefined
    }
    afterLeaveFlag.value = true
    clearTimeout(afterLeaveTimer)

    afterLeaveTimer = window.setTimeout(() => {
      if (afterLeaveFlag.value) {
        afterLeaveFlag.value = false
        destroySelf()
      }
    }, 400)
    data.visible = false
  }

  function handleAfterLeave() {
    if (!afterLeaveFlag.value) return
    afterLeaveFlag.value = false
    destroySelf()
  }

  function changeEmpty(value: boolean) {
    data.showEmpty = value
  }

  const componentSetupConfig = {
    ...toRefs(data),
    setText,
    close,
    handleAfterLeave,
  }

  const elLoadingComponent = defineComponent({
    name: 'ElLoading',
    setup() {
      return componentSetupConfig
    },
    render() {
      const spinner = h('svg', {
        class: 'circular',
        viewBox: '25 25 50 50',
      }, [
        h('circle', { class: 'path', cx: '50', cy: '50', r: '20', fill: 'none' }),
      ])

      const noSpinner = h('i', { class: this.spinner })

      const spinnerText = h('p', { class: 'el-loading-text' }, [this.text])

      const loadingContent = h('div', {
        class: 'el-loading-spinner',
      }, [
        this.spinner ? noSpinner : spinner,
        this.text ? spinnerText : null,
      ])

      return h(Transition, {
        name: 'el-loading-fade',
        onAfterLeave: this.handleAfterLeave,
      }, {
        default: withCtx(() => [
          withDirectives(
            createVNode('div', {
              style: {
                backgroundColor: this.background || '',
              },
              class: [
                'el-loading-mask',
                this.customClass,
                this.fullscreen ? 'is-fullscreen' : '',
              ],
            },
            [
              !this.empty ? loadingContent : '',
              this.empty
                ? withDirectives(
                  createVNode(
                    Empty,
                    this.emptyOption ? this.emptyOption : {},
                  ),
                  [[vShow, !this.showEmpty]])
                : '',
              this.empty
                ? withDirectives(loadingContent, [[vShow, this.showEmpty]])
                : '',
            ]),
            [[vShow, this.visible]],
          ),
        ]),
      })
    },
  })

  vm = createVNode(elLoadingComponent)

  render(vm, document.createElement('div'))

  return {
    ...componentSetupConfig,
    vm,
    changeEmpty,
    get $el() {
      return vm.el as HTMLElement
    },
  }
}
