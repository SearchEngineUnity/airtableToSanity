import {
  initializeBlock,
  useBase,
  useRecords,
  Button,
  Box
} from '@airtable/blocks/ui';
import React, {useState} from 'react';

function App() {
    const base = useBase();
    // const globalConfig = useGlobalConfig();
    const table = base.getTableByName('quote');
    const fieldNames = table.fields.map(field => field.name)
    const records = useRecords(table);
    const recordsList = records.map(record => {return {
      "createOrReplace": {
      '_id': record.id || null,
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
  
  function createOrReplaceEntry(mutations) {
    
    let url = "https://hhd5q8cp.api.sanity.io/v1/data/mutate/production";
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Security-Policy": 'base-uri',
        "Authorization": "Bearer " + "skCGs2ZAU36V7b2pHd4YVPeIejfBHgEJQRsUUXOaAmg2YfQh0h5nWzJzrL9LBLwXuqlFGAk5vRofr1kDGL7Dp9HPFeWakjTHNTSsvOzuaGaldT8qAp2U0PD96mSusgLJLMe4SPcc7hC11eyBYW8WlxcDluavQ8L5w5DajBnho4QJ7NNG6Qdg",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({mutations}),
    })
    .then(response => response.json())
    .then(result => console.log(result))
    .catch(error => console.error(error))
  }

  createOrReplaceEntry(mutations)

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
      <Button variant="primary" onClick={(e) => {}} icon="edit">
        Create or Replace
      </Button>
    </Box>
  )
}

initializeBlock(() => <App />);
