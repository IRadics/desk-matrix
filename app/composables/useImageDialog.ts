import { ImageDialog } from '#components'

export interface ImageDialogOptions {
  src: string
  onCloseFn?: () => void
}

export const useImageDialog = () => {
  const overlay = useOverlay()

  return (options: ImageDialogOptions): Promise<boolean> => {
    console.log(options.onCloseFn)
    const modal = overlay.create(ImageDialog, {
      destroyOnClose: true,
      props: options,
    })

    return modal.open()
  }
}
