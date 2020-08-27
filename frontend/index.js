import React, {useState} from 'react';
import {cursor} from '@airtable/blocks';
import {
  initializeBlock,
  useBase,
  useRecords,
  useGlobalConfig,
  Button,
  Box,
  useLoadable,
  useWatchable
} from '@airtable/blocks/ui';




function postToSanity(mutations, table, records) {
  
    console.log(mutations)
  let url = "https://hhd5q8cp.api.sanity.io/v1/data/mutate/production";

  fetch(url, {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + "skCGs2ZAU36V7b2pHd4YVPeIejfBHgEJQRsUUXOaAmg2YfQh0h5nWzJzrL9LBLwXuqlFGAk5vRofr1kDGL7Dp9HPFeWakjTHNTSsvOzuaGaldT8qAp2U0PD96mSusgLJLMe4SPcc7hC11eyBYW8WlxcDluavQ8L5w5DajBnho4QJ7NNG6Qdg",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({mutations}),
  })
  .then(response => response.json())
  .then(result => {
    if (result.results[0].operation === "delete") {
      records.forEach(record => {
        table.updateRecordAsync(record, {
          "published" :false, 
          "Exclude from Sanity" :true, 
          "sanityId": '',
        });
      })
    }
  let airtableRecordId = mutations[0].createOrReplace.airtableId.split('-')[2]
    table.updateRecordsAsync([
      {id: airtableRecordId, fields: {"sanityId": mutations[0].createOrReplace._id, "published": true, "airtableId": mutations[0].createOrReplace.airtableId}},
    ])
  })
  .catch(error => console.error(error))
}
//If a document is being referenced by Sanity it can not be deleted will likely result in 409 error.
function deleteMutations (records, table) {
  const mutations = [{"delete": {"query": "*[_type == 'quote']"}}];

  postToSanity(mutations, table, records)
}

function createAndUpdateMutations(records, table, baseId, tableId) {
  const recordsList = records.map(record => {
    if (record.getCellValueAsString("Exclude from Sanity") === "checked") {
      console.log('excluded')
      return {}
    }
    
    let id = record.getCellValueAsString('sanityId')? record.getCellValueAsString('sanityId') : `${baseId}-${tableId}-${record.id}`

    return {
    "createOrReplace": {
    '_id': id,
    'airtableId': `${baseId}-${tableId}-${record.id}`,
    '_type': "quote",
    'text': record.getCellValueAsString('text') || null,
    'source': record.getCellValueAsString('source') || null,
    'day': record.getCellValueAsString('day') || null,
    'youtube': record.getCellValueAsString('youtube') || null,
    'shortLink': record.getCellValueAsString('shortLink') || null,    
    'dropbox': record.getCellValueAsString('dropbox') || null,
    'primary': {
      '_ref': record.getCellValueAsString('primary/_ref') || null,
      '_type': record.getCellValueAsString('primary/_type') || null
    },
    'secondary': {
      '_ref': record.getCellValueAsString('secondary/_ref') || null,
      '_type': record.getCellValueAsString('secondary/_type') || null
    },
    'qualifying': {
      '_ref': record.getCellValueAsString('qualifying/_ref') || null,
      '_type': record.getCellValueAsString('qualifying/_type') || null
    },
  }}})
 
  const removeEmpty = obj => 
    Object.fromEntries(
      Object.entries(obj)
      .filter(([k, v]) => v !== null)
      .map(([k, v]) => (typeof v === "object" ? [k, removeEmpty(v)] : [k, v]))
      .filter(([k, v]) => Object.keys(v).length !== 0)
    );
    
  const mutations = recordsList.map(r => removeEmpty(r))

  mutations.forEach(el => {postToSanity([el], table)})
}

function App() {
  const base = useBase();
  const table = base.getTableByName('quote');
  const baseId = base._id
  const tableId = table._id
  const records = useRecords(table);
    useLoadable(cursor);
    useWatchable(cursor, ['selectedRecordIds', 'selectedFieldIds']);
    
        console.log({'Selected records': cursor.selectedRecordIds.join(', '),
        'Selected fields': cursor.selectedFieldIds.join(', ')})
  
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      border="default"
      backgroundColor="white"
      padding="20px"
      width="100vw"
      height="100vh"
      overflow="hidden"
    >
      <Button variant="primary" onClick={(e) => {createAndUpdateMutations(records, table, baseId, tableId)}} icon="edit">
        Create or Replace All Records in Sanity
      </Button>
      <br></br>
      <br></br>
      <Button variant="primary" onClick={(e) => {deleteMutations(records, table)}} icon="edit">
        Delete All Records from Sanity
      </Button>
      <br></br>
      <br></br>
      <Button variant="primary" onClick={(e) => {deleteMutations(records, table)}} icon="edit">
        Delete Selected Record from Sanity
      </Button>
    </Box>
  )
}

initializeBlock(() => <App />);
