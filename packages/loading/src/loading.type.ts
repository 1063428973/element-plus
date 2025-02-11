import type { Ref, VNode } from 'vue'

export type ILoadingEmptyOption = {
  image: string
  imageSize: number
  description: string
}

export type ILoadingOptions = {
    parent?: ILoadingParentElement
    background?: string
    spinner?: boolean | string
    text?: string
    fullscreen?: boolean
    body?: boolean
    lock?: boolean
    customClass?: string
    visible?: boolean
    target?: string | HTMLElement
    empty?: boolean
    showEmpty?: boolean
    emptyOption?: ILoadingEmptyOption
}

export type ILoadingInstance = {
    parent?: Ref<ILoadingParentElement>
    background?: Ref<string>
    spinner?: Ref<boolean | string>
    text?: Ref<string>
    fullscreen?: Ref<boolean>
    body?: Ref<boolean>
    lock?: Ref<boolean>
    customClass?: Ref<string>
    visible?: Ref<boolean>
    target?: Ref<string | HTMLElement>
    originalPosition?: Ref<string>
    originalOverflow?: Ref<string>
    empty?: Ref<boolean>
    showEmpty?: Ref<boolean>
    setText: (text: string) => void
    close: () => void
    handleAfterLeave: () => void
    changeEmpty: (value: boolean) => void
    vm: VNode
    $el: HTMLElement
}

export type ILoadingGlobalConfig = {
    fullscreenLoading: ILoadingInstance
}

export type ILoadingCreateComponentParams = {
    options: ILoadingOptions
    globalLoadingOption: ILoadingGlobalConfig
}

export interface ILoadingParentElement extends HTMLElement {
    vLoadingAddClassList?: () => void
}
