import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';

import formSpecJSON from "./formsNew.json";

function App() {

  const formSpec = formSpecJSON;
  const [isFirst, setIsFirst] = useState(true);
  // Encode string method to URI
  const encodeFunction = (func) => {
    return encodeURIComponent(JSON.stringify(func));
  }

  const getFormURI = (form, ofsd, prefillSpec) => {
    console.log(form, ofsd, prefillSpec);
    return encodeURIComponent(`http://localhost:3002/prefill?form=${form}&onFormSuccessData=${encodeFunction(ofsd)}&prefillSpec=${encodeFunction(prefillSpec)}`);
  }

  const startingForm = formSpec.start;
  const [formId, setFormId] = useState(startingForm);
  const [encodedFormSpec, setEncodedFormSpec] = useState(encodeURI(JSON.stringify(formSpec.forms[formId])));
  const [onFormSuccessData, setOnFormSuccessData] = useState(undefined);
  const [onFormFailureData, setOnFormFailureData] = useState(undefined);
  const [encodedFormURI, setEncodedFormURI] = useState(getFormURI(formId, formSpec.forms[formId].onSuccess, formSpec.forms[formId].prefill));

  useEffect(() => {
    // Manage onNext
    window.addEventListener('message', function (e) {
      const data = e.data;
      try {
        /* message = {
          nextForm: "formID",
          formData: {},
        }
        */
        const { nextForm, formData, onSuccessData, onFailureData } = JSON.parse(data);
        console.log({ nextForm, formData, onSuccessData, onFailureData });
        if (nextForm.type === 'form') {
          setFormId(nextForm.id);
          setOnFormSuccessData(onSuccessData);
          setOnFormFailureData(onFailureData);
          setEncodedFormSpec(encodeURI(JSON.stringify(formSpec.forms[formId])));
          setEncodedFormURI(getFormURI(nextForm.id, onSuccessData, formSpec.forms[nextForm.id].prefill));
        } else {
          window.location.href = nextForm.url;
        }
      }
      catch (e) {
        // console.log(e)
      }
    });
  }, []);


  return (
    <div className="App">
      <iframe title='current-form'
        style={{ height: "100vh", width: "100vw" }}
        src={
          `http://localhost:8005/preview?formSpec=${encodedFormSpec}&xform=${encodedFormURI}`
        }
      />

    </div>
  );
}

export default App;
