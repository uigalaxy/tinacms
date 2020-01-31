import * as React from 'react'
import {
  BlockTemplate,
  ModalActions,
  ModalHeader,
  ModalBody,
  Modal,
  ModalProvider,
  ModalPopup,
} from 'tinacms'
import { useJsonForm } from 'next-tinacms-json'
import { FieldsBuilder } from '@tinacms/form-builder'
import { Button } from '../../@tinacms/styles/build/index.js'
import {
  InlineForm,
  InlineTextField,
  InlineBlocks,
  BlockText,
  InlineFormContext,
  InlineBlocksContext,
  InlineBlockContext,
} from '../react-tinacms-inline'

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
  const { status } = React.useContext(InlineFormContext)
  const { insert, move, remove, blocks, count } = React.useContext(
    InlineBlocksContext
  )
  const isFirst = index === 0
  const isLast = index === count - 1

  const [open, setOpen] = React.useState(false)

  if (status === 'inactive') {
    return children
  }
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
      fileRelativePath: `data/blocks.json`,
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
