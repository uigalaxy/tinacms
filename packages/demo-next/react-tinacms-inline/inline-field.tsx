import * as React from 'react'
import { Field, FieldRenderProps } from 'react-final-form'
import { InlineFormState, InlineFormContext } from './inline-form'

/**
 *
 */
export interface InlineFieldProps {
  name: string
  children(fieldProps: InlineFieldRenderProps): React.ReactElement
}

export interface InlineFieldRenderProps<V = any>
  extends Partial<FieldRenderProps<V>>,
    InlineFormState {}

export function InlineField({ name, children }: InlineFieldProps) {
  const formState = React.useContext(InlineFormContext)

  return (
    <Field name={name}>
      {fieldProps => {
        return children({
          ...fieldProps,
          ...formState,
        })
      }}
    </Field>
  )
}
