import * as React from 'react'
import {
  Form,
  BlockTemplate,
  ModalActions,
  ModalHeader,
  ModalBody,
  Modal,
  ModalProvider,
  ModalPopup,
} from 'tinacms'
import { useJsonForm } from 'next-tinacms-json'
import { FormBuilder, FieldsBuilder } from '@tinacms/form-builder'
import { Field, FormRenderProps, FieldRenderProps } from 'react-final-form'
import { Button } from '../../@tinacms/styles/build/index.js'

/**
 * This is an example page that uses Blocks from Json
 */
export default function BlocksExample({ jsonFile }) {
  const [, form] = useJsonForm(jsonFile)

  if (!form) return null

  return (
    <ModalProvider>
      <InlineForm form={form}>
        <EditToggle />
        <DiscardChanges />
        <h1>
          <InlineTextField name="title" />
        </h1>
        <InlineBlocks name="blocks" blocks={PAGE_BUILDER_BLOCKS} />
      </InlineForm>
    </ModalProvider>
  )
}

/**
 * Blocks consist of a `template` and a `Component`
 */
interface Block {
  Component: any
  template: BlockTemplate
}

/**
 * CallToAction template + Component
 */
const cta_template: BlockTemplate = {
  type: 'cta',
  label: 'Call to Action',
  defaultItem: { url: '', text: 'Signup!' },
  key: undefined,
  fields: [
    { name: 'text', label: 'Text', component: 'text' },
    { name: 'url', label: 'URL', component: 'text' },
  ],
}

function CallToActionBlock({ data, index }) {
  return (
    <BlocksControls index={index}>
      <button
        onClick={() => window.open(data.url, '_blank')}
        style={{ display: 'block', background: 'pink' }}
      >
        {data.text}
      </button>
    </BlocksControls>
  )
}

/**
 * Hero template + Component
 */
const hero_template: BlockTemplate = {
  type: 'hero',
  label: 'Hero',
  defaultItem: { text: 'Spiderman' },
  key: undefined,
  fields: [],
}

function HeroBlock({ index }) {
  return (
    <BlocksControls index={index}>
      <h2>
        My Hero: <BlockText name="text" />
      </h2>
    </BlocksControls>
  )
}

/**
 * This is the Blocks lookup that was passed to `<InlineBlocks>` in the
 * main `BlocksExample` component.
 */
const PAGE_BUILDER_BLOCKS = {
  cta: {
    Component: CallToActionBlock,
    template: cta_template,
  },
  hero: {
    Component: HeroBlock,
    template: hero_template,
  },
}

/**
 * Each of the Block.Components had this wrapping their content. It provides
 * The controls for editing blocks.
 */
function BlocksControls({ children, index }) {
  const { insert, move, remove, blocks, count } = React.useContext(
    InlineBlocksContext
  )
  const isFirst = index === 0
  const isLast = index === count - 1

  const [open, setOpen] = React.useState(false)
  return (
    <div
      style={{ border: '1px solid green', maxWidth: '500px', margin: '16px' }}
    >
      {Object.entries(blocks)
        .map(([, block]) => block.template)
        .map(template => {
          return (
            <button
              onClick={() => {
                console.log(template)
                insert(index + 1, {
                  _template: template.type,
                  ...template.defaultItem,
                })
              }}
            >
              Add {template.label}
            </button>
          )
        })}
      <button onClick={() => remove(index)}>Remove</button>
      <button onClick={() => move(index, index - 1)} disabled={isFirst}>
        Up
      </button>
      <button onClick={() => move(index, index + 1)} disabled={isLast}>
        Down
      </button>
      <button onClick={() => setOpen(p => !p)}>Settings</button>
      {open && (
        <BlockSettings
          template={blocks.cta.template}
          close={() => setOpen(false)}
        />
      )}
      {children}
    </div>
  )
}

function BlockSettings({ template, close }: any) {
  const { form } = React.useContext(InlineFormContext)
  const { name } = React.useContext(InlineBlockContext)

  const fields = template.fields.map((subField: any) => ({
    ...subField,
    name: `${name}.${subField.name}`,
  }))

  return (
    <Modal>
      <ModalPopup>
        <ModalHeader close={close}>Settings</ModalHeader>
        <ModalBody>
          <FieldsBuilder form={form} fields={fields} />
        </ModalBody>
        <ModalActions>
          <Button onClick={close}>Cancel</Button>
        </ModalActions>
      </ModalPopup>
    </Modal>
  )
}

/**
 * EVERYTHING BELOW HERE IS NOT IMPORTANT TO UNDERSTANDING BLOCKS
 */

BlocksExample.getInitialProps = async function() {
  const blocksData = await import(`../data/blocks.json`)
  return {
    jsonFile: {
      fileRelativePath: `data/index.json`,
      data: blocksData.default,
    },
  }
}

/**
 * Toggle
 */
function EditToggle() {
  const { status, deactivate, activate } = React.useContext(InlineFormContext)

  return (
    <button
      onClick={() => {
        status === 'active' ? deactivate() : activate()
      }}
    >
      {status === 'active' ? 'Preview' : 'Edit'}
    </button>
  )
}

function DiscardChanges() {
  const { form } = React.useContext(InlineFormContext)

  return (
    <button
      onClick={() => {
        form.finalForm.reset()
      }}
    >
      Discard Changes
    </button>
  )
}

/**
 * InlineForm
 *
 * Sets up a FinaForm context and tracks the state of the form.
 */
interface InlineFormProps {
  form: Form
  children: React.ReactElement | React.ReactElement[] | InlineFormRenderChild
}

type InlineFormRenderChild = (
  props: FormRenderProps &
    Pick<InlineFormState, 'activate' | 'deactivate' | 'status'>
) => any

interface InlineFormState {
  form: Form
  status: InlineFormStatus
  activate(): void
  deactivate(): void
}
type InlineFormStatus = 'active' | 'inactive'

function InlineForm({ form, children }: InlineFormProps) {
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

const InlineFormContext = React.createContext<InlineFormState | null>(null)

/**
 *
 */
interface InlineFieldProps {
  name: string
  children(fieldProps: InlineFieldRenderProps): React.ReactElement
}

interface InlineFieldRenderProps<V = any>
  extends Partial<FieldRenderProps<V>>,
    InlineFormState {}

function InlineField({ name, children }: InlineFieldProps) {
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

/**
 * InlineTextField
 */
interface InlineTextFieldProps {
  name: string
}
function InlineTextField({ name }: InlineTextFieldProps) {
  return (
    <InlineField name={name}>
      {({ input, status }) => {
        if (status === 'active') {
          return <input type="text" {...input} />
        }
        return <>{input.value}</>
      }}
    </InlineField>
  )
}

/**
 * Blocks
 */

interface InlineBlocksProps {
  name: string
  blocks: {
    [key: string]: Block
  }
}

interface InlineBlocksActions {
  count: number
  insert(index: number, data: any): void
  move(froom: number, to: number): void
  remove(index: number): void
  blocks: {
    [key: string]: Block
  }
}

const InlineBlocksContext = React.createContext<InlineBlocksActions>(null)

function InlineBlocks({ name, blocks }: InlineBlocksProps) {
  return (
    <InlineField name={name}>
      {({ input, form }) => {
        const allData = input.value || []

        const move = (from: number, to: number) => {
          form.mutators.move(name, from, to)
        }

        const remove = (index: number) => {
          form.mutators.remove(name, index)
        }

        const insert = (index: number, block: any) => {
          form.mutators.insert(name, index, block)
        }

        return (
          <InlineBlocksContext.Provider
            value={{ insert, move, remove, blocks, count: allData.length }}
          >
            {allData.map((data, index) => {
              const Block = blocks[data._template]

              if (!Block) {
                console.warn('Unrecognized Block of type:', data._template)
                return null
              }

              const blockName = `${input.name}.${index}`

              return (
                <InlineBlock
                  index={index}
                  name={blockName}
                  data={data}
                  block={Block}
                />
              )
            })}
          </InlineBlocksContext.Provider>
        )
      }}
    </InlineField>
  )
}

/**
 * InlineBlock
 */
interface InlineBlockProps {
  index: number
  name: string
  data: any
  block: Block
}
function InlineBlock({ name, data, block, index }: InlineBlockProps) {
  return (
    <InlineBlockContext.Provider value={{ name }}>
      <block.Component data={data} index={index} />
    </InlineBlockContext.Provider>
  )
}

const InlineBlockContext = React.createContext<any>(null)

interface BlockFieldProps {
  name: string
  children: any
}

function BlockField({ name, children }: BlockFieldProps) {
  const block = React.useContext(InlineBlockContext)
  const fieldName = `${block.name}.${name}`
  return <InlineField name={fieldName}>{children}</InlineField>
}

/**
 * InlineTextField
 */
interface BlockText {
  name: string
}
function BlockText({ name }: InlineTextFieldProps) {
  return (
    <BlockField name={name}>
      {({ input, status }) => {
        if (status === 'active') {
          return <input type="text" {...input} />
        }
        return <>{input.value}</>
      }}
    </BlockField>
  )
}
