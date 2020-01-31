import * as React from 'react'
import { Form } from 'tinacms'
import { FormBuilder } from '@tinacms/form-builder'
import { FormRenderProps } from 'react-final-form'

export interface InlineFormProps {
  form: Form
  children: React.ReactElement | React.ReactElement[] | InlineFormRenderChild
}

export interface InlineFormRenderChild {
  (props: InlineFormRendeChildOptions):
    | React.ReactElement
    | React.ReactElement[]
}

export type InlineFormRendeChildOptions = InlineFormState &
  Omit<FormRenderProps<any>, 'form'>

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
        {({ form, ...formProps }) => {
          if (typeof children !== 'function') {
            return children
          }

          return children({
            ...formProps,
            ...inlineFormState,
          })
        }}
      </FormBuilder>
    </InlineFormContext.Provider>
  )
}

export const InlineFormContext = React.createContext<InlineFormState>(null)
