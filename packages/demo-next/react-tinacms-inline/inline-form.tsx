import * as React from 'react'
import { Form } from 'tinacms'
import { FormBuilder } from '@tinacms/form-builder'
import { FormRenderProps } from 'react-final-form'

/**
 * InlineForm
 *
 * Sets up a FinaForm context and tracks the state of the form.
 */
export interface InlineFormProps {
  form: Form
  children: React.ReactElement | React.ReactElement[] | InlineFormRenderChild
}

export type InlineFormRenderChild = (
  props: FormRenderProps &
    Pick<InlineFormState, 'activate' | 'deactivate' | 'status'>
) => any

export interface InlineFormState {
  form: Form
  status: InlineFormStatus
  activate(): void
  deactivate(): void
}
export type InlineFormStatus = 'active' | 'inactive'

export function InlineForm({ form, children }: InlineFormProps) {
  const [status, setStatus] = React.useState<InlineFormStatus>('inactive')

  const inlineFormState = React.useMemo(() => {
    return {
      form,
      status,
      activate: () => setStatus('active'),
      deactivate: () => setStatus('inactive'),
    }
  }, [form, status])

  return (
    <InlineFormContext.Provider value={inlineFormState}>
      <FormBuilder form={form}>
        {formProps => {
          if (typeof children !== 'function') {
            return children
          }
          // @ts-ignore
          return children({
            ...inlineFormState,
            ...formProps,
          })
        }}
      </FormBuilder>
    </InlineFormContext.Provider>
  )
}

export const InlineFormContext = React.createContext<InlineFormState | null>(
  null
)
