import * as React from 'react'
import { BlockTemplate, ModalProvider } from 'tinacms'
import { useJsonForm } from 'next-tinacms-json'
import {
  InlineForm,
  InlineTextField,
  InlineBlocks,
  BlockText,
  InlineFormContext,
} from '../react-tinacms-inline'
import { BlocksControls } from '../react-tinacms-inline/inline-block-field-controls'

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
