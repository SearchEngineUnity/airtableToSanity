import {
  Button,
  FieldPickerSynced,
  FormField,
  InputSynced,
  TablePickerSynced,
  useBase,
  useGlobalConfig,
} from '@airtable/blocks/ui';
import React, {useState} from 'react';

function BlockSettings({setIsShowingSettings}) {
  const globalConfig = useGlobalConfig();
  const base = useBase();
  const table = base.getTableByIdIfExists(globalConfig.get('tableId'));
  const customCss = globalConfig.get('customCss');
  const settings = validateSettings();
  const canSetSettings = globalConfig.checkPermissionsForSet('customCss').hasPermission;

  return (
    <div style={{padding: '15px', 'height': '100vh'}}>
      <FormField
        label="Table containing quotes"
        description="Records will be published as Sanity Quotes"
      >
        <TablePickerSynced
          globalConfigKey='tableId'
        />
      </FormField>
      <FormField
        label="Sanity Quote Id field"
        >
        <FieldPickerSynced table={table}
          globalConfigKey='quoteIdFieldId'
        />
      </FormField>
      <FormField
        label="Text field"
      >
        <FieldPickerSynced table={table}
          globalConfigKey='textFieldId'
        />
      </FormField>
      <FormField
        label="Source field"
       >
        <FieldPickerSynced table={table}
          globalConfigKey='sourceFieldId'
        />
      </FormField>
      <FormField
        label="Day field"
       >
        <FieldPickerSynced table={table}
          globalConfigKey='dayFieldId'
        />
      </FormField>
      <FormField
        label="Youtube field"
      >
        <FieldPickerSynced table={table}
          globalConfigKey='youtubeFieldId'
        />
      </FormField>
      <FormField
        label="Short Link field"
      >
        <FieldPickerSynced table={table}
          globalConfigKey='shortLinkFieldId'
        />
      </FormField>
      <FormField
        label="Dropbox field"
      >
        <FieldPickerSynced table={table}
          globalConfigKey='dropboxFieldId'
        />
      </FormField>
      <FormField
        label="Primary/_ref field"
      >
        <FieldPickerSynced table={table}
          globalConfigKey='primaryRefFieldId'
        />
      </FormField>
      <FormField
        label="Sticky field (optional)"
        description="Can be any field type"
      >
        <FieldPickerSynced table={table}
          globalConfigKey='stickyFieldId'
        />
      </FormField>
      <FormField
        label="Custom CSS for preview (optional)"
        description="Used only when previewing the post content"
      >
        <textarea
          value={customCss}
          placeholder="Enter custom css to use when displaying the html preview."
          rows= "5"
          style={{width: '100%', resize:'none'}}
          onChange={(e)=>globalConfig.setAsync('customCss', e.target.value)}
          disabled={!canSetSettings}
        />
      </FormField>

      <div style={{display: 'flex', 'justifyContent': 'flex-end'}}>
      <Button
        variant="primary"
        onClick={()=>setIsShowingSettings(false)}
        disabled={!settings}
        alignSelf="flex-end"
      >
      Done
      </Button>
      </div>
      <p>Copyright © 2020, Kuovonne Vorderbruggen</p>
    </div>
  );
}

function validateSettings() {
  const globalConfig = useGlobalConfig();
  const base = useBase();
  // check if there is a table
  const table = base.getTableByIdIfExists(globalConfig.get('tableId'));
  if (!table) { return false; }
  // check if there is a WordPress domain
  const wordPressDomain = globalConfig.get('wordPressDomain');
  if (!wordPressDomain) {
    return false;
  }
  // check if there are the required fields
  const postIdField = table.getFieldByIdIfExists(globalConfig.get('postIdFieldId'));
  const titleField = table.getFieldByIdIfExists(globalConfig.get('titleFieldId'));
  const contentField = table.getFieldByIdIfExists(globalConfig.get('contentFieldId'));
  if (!postIdField || !titleField || !contentField) {
    return false;
  }
  // check for optional fields
  const slugField = table.getFieldByIdIfExists(globalConfig.get('slugFieldId'));
  const dateField = table.getFieldByIdIfExists(globalConfig.get('dateFieldId'));
  // if there is a date field, it must show a time
  if (dateField && dateField.type != "dateTime") {
    return false;
  }
  const stickyField = table.getFieldByIdIfExists(globalConfig.get('stickyFieldId'));
  const categoryField = table.getFieldByIdIfExists(globalConfig.get('categoryFieldId'));
  const tagField = table.getFieldByIdIfExists(globalConfig.get('tagFieldId'));
  return {
    "wordPressDomain" : globalConfig.get('wordPressDomain'),
    "table": table,
    "postIdField": postIdField,
    "titleField": titleField,
    "contentField": contentField,
    "dateField": dateField,
    "slugField": slugField,
    "stickyField": stickyField,
    "categoryField": categoryField,
    "tagField": tagField,
    "customCss" : globalConfig.get('customCss'),
  };
}

export {validateSettings};
export default BlockSettings;
