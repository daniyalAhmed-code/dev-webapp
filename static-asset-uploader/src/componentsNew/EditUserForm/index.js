import React, { useState } from "react"
import { Form, Button } from "semantic-ui-react"

const mnoLocationOptions = [
  { key: "Cz", text: "Czech Republic", value: "Czech_Republic" },
  { key: "Gr", text: "Greece", value: "Greece" },
  { key: "Hg", text: "Hungary", value: "Hungary" },
  { key: "It", text: "Italy", value: "Italy" },
  { key: "Pt", text: "Portugal", value: "Portugal" },
  { key: "Rm", text: "Romania", value: "Romania" },
  { key: "Sp", text: "Spain", value: "Spain" },
  { key: "Uk", text: "United Kingdom", value: "United_Kingdom" },
]

const mnoOptions = [
  {
    key: "Ot",
    text: "One Telecommunications",
    value: "One Telecommunications",
  },
  { key: "Or", text: "Orange", value: "Orange" },
  { key: "Te", text: "Telefónica", value: "Telefónica" },
  { key: "Vd", text: "Vodafone", value: "Vodafone" },
]

function EditUserForm() {
  // state for callBackUrl
  const [formImages, setFormImages] = useState({
    profileImage: "",
    AuthCertificate: "",
  })
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader()
      fileReader.readAsDataURL(file)
      fileReader.onload = () => {
        resolve(fileReader.result)
      }
      fileReader.onerror = (error) => {
        reject(error)
      }
    })
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    const name = e.target.name
    const base64 = await convertToBase64(file)
    setFormImages({ ...formImages, [name]: base64 })
  }
  // const handleFileUpload = (evt) => {
  //   let files = evt.target.files;
  //   let name = evt.target.name;
  //   let reader = new FileReader();
  //   reader.readAsDataURL(files[0]);

  //   reader.onload = (e) => {
  //     setFormImages({ ...formImages, [name]: e.target.result });
  //     console.log(formImages)
  //   };
  // };
  const [authType, setAuthType] = useState("")
  const [values, setValues] = useState({
    type: "",
    targetEmailAddress: "",
    targetPhoneNumber: "",
    targetFirstName: "",
    targetLastName: "",
    targetApiKeyDuration: "",
    targetMnoLocation: "",
    targetCallBackAuth: "",
    targetMno: "",
    targetMfa: "",
    targetCallBackUrl: "",
  })
  const createUserData = (data) => {
    let dataMfa = data.targetMfa === "yes" ? true : false
    switch (data.type) {
      case "apiKey":
        return {
          type: "apiKey",
          targetEmailAddress: data.targetEmailAddress,
          targetPhoneNumber: data.targetPhoneNumber,
          targetFirstName: data.targetFirstName,
          targetLastName: data.targetLastName,
          targetApiKeyDuration: data.targetApiKeyDuration,
          targetMnoLocation: data.targetMnoLocation,
          targetCallBackAuth: data.AuthApi,
          targetMno: data.targetMno,
          targetMfa: dataMfa,
          targetCallBackUrl: data.targetCallBackUrl,
        }
      case "basicAuth":
        return {
          type: "basicAuth",
          targetEmailAddress: data.targetEmailAddress,
          targetPhoneNumber: data.targetPhoneNumber,
          targetFirstName: data.targetFirstName,
          targetLastName: data.targetLastName,
          targetApiKeyDuration: data.targetApiKeyDuration,
          targetMnoLocation: data.targetMnoLocation,
          targetCallBackAuth: {
            username: data.AuthUsername,
            password: data.AuthPassword,
          },
          targetMno: data.targetMno,
          targetMfa: dataMfa,
          targetCallBackUrl: data.targetCallBackUrl,
        }
      case "privateCertificate":
        return {
          type: "privateCertificate",
          targetEmailAddress: data.targetEmailAddress,
          targetPhoneNumber: data.targetPhoneNumber,
          targetFirstName: data.targetFirstName,
          targetLastName: data.targetLastName,
          targetApiKeyDuration: data.targetApiKeyDuration,
          targetMnoLocation: data.targetMnoLocation,
          targetCallBackAuth: formImages.AuthCertificate,
          targetMno: data.targetMno,
          targetMfa: dataMfa,
          targetCallBackUrl: data.targetCallBackUrl,
        }
      default:
        return null
    }
  }
  const handleAuthType = (e, { value }) => {
    setAuthType(value)
    setValues({ ...values, type: value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    console.log(createUserData(values))
  }
  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value })
  }
  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <Form.Group widths="equal">
          <Form.Field>
            <label>First Name</label>
            <input
              placeholder="First Name"
              type="text"
              name="targetFirstName"
              onChange={handleChange}
            />
          </Form.Field>

          <Form.Field>
            <label>Last Name</label>
            <input
              placeholder="Last Name"
              type="text"
              name="targetLastName"
              onChange={handleChange}
            />
          </Form.Field>
        </Form.Group>
        <Form.Group widths="equal">
          <Form.Field>
            <label> Email Address </label>
            <input
              placeholder="Email address"
              type="email"
              name="targetEmailAddress"
              onChange={handleChange}
              pattern="^[\w.!#$%&'*+/=?^`{|}~-]+@[^_\W]([a-z\d-]{0,61}[^_\W])?(\.[^_\W]([a-z\d-]{0,61}[^_\W])?)*$"
              disabled
            />
          </Form.Field>
          <Form.Field>
            <label> Enable MFA?</label>
            <label htmlFor="enable mfa" inline="true">
              <input
                type="radio"
                name="targetMfa"
                value="yes"
                checked={values.targetMfa === "yes"}
                id="mfa-yes"
                onChange={handleChange}
              />
              Yes
            </label>
            <label htmlFor="enable mfa" inline="true">
              <input
                type="radio"
                name="targetMfa"
                value="no"
                checked={values.targetMfa === "no"}
                id="mfa-no"
                onChange={handleChange}
              />
              No
            </label>
          </Form.Field>
        </Form.Group>
        <Form.Group widths="equal">
          <Form.Field>
            <label> Phone Number</label>
            <input
              type="tel"
              placeholder="Phone Number"
              name="targetPhoneNumber"
              pattern="^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]{8,14}$"
              onChange={handleChange}
            />
          </Form.Field>
          <Form.Field>
            <label>Profile Image</label>
            <input
              type="file"
              name="profileImage"
              accept="image/png, image/gif, image/jpeg"
              onChange={(e) => handleFileUpload(e)}
            />
          </Form.Field>
        </Form.Group>
        <Form.Group widths="equal">
          <Form.Field>
            <label htmlFor="mnoOptions"> Select MNO... </label>
            <select
              name="targetMno"
              id="mnoOptions"
              onChange={handleChange}
              required
            >
              {mnoOptions.map(({ key, text, value }) => (
                <option key={key} value={value}>
                  {text}
                </option>
              ))}
            </select>
          </Form.Field>

          <Form.Field>
            <label htmlFor="mnoLocation"> Select MNO location... </label>
            <select
              name="targetMnoLocation"
              id="mnoLocation"
              onChange={handleChange}
              required
            >
              {mnoLocationOptions.map(({ key, text, value }) => (
                <option key={key} value={value}>
                  {text}
                </option>
              ))}
            </select>
          </Form.Field>
        </Form.Group>

        <Form.Group>
          <Form.Field width={11}>
            <label htmlFor="callback">Enter Callback URL:</label>
            <input
              id="callback"
              type="text"
              placeholder="https://www."
              name="targetCallBackUrl"
              onChange={handleChange}
              pattern="https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)"
              required
            />
          </Form.Field>
          <Form.Field width={3}>
            <label htmlFor="">API Key Duration</label>
            <input
              type="number"
              min="1"
              max="90"
              onChange={handleChange}
              placeholder="Enter API Key Duration"
              name="targetApiKeyDuration"
              required
            />
            <span inline="true">Days</span>
          </Form.Field>
        </Form.Group>
        <Form.Group inline>
          <label> Select Callback Auth Type</label>
          <Form.Radio
            label="Api key"
            value="apiKey"
            checked={authType === "apiKey"}
            onChange={handleAuthType}
            name="type"
          />
          <Form.Radio
            label="Basic Auth"
            value="basicAuth"
            checked={authType === "basicAuth"}
            onChange={handleAuthType}
            name="type"
          />
          <Form.Radio
            label="Private certificate"
            value="privateCertificate"
            checked={authType === "privateCertificate"}
            onChange={handleAuthType}
            name="type"
          />
        </Form.Group>
        {(() => {
          switch (authType) {
            case "apiKey":
              return (
                <Form.Group widths="equal">
                  <Form.Input
                    fluid
                    label="Auth Credential Content"
                    placeholder="Auth Credential Content"
                    name="AuthApi"
                    required
                  />
                </Form.Group>
              )
            case "basicAuth":
              return (
                <Form.Group widths="equal">
                  <Form.Field fluid="true">
                    <label>Auth username</label>
                    <input
                      placeholder="Auth username"
                      type="text"
                      name="AuthUsername"
                      required
                      onChange={handleChange}
                    />
                  </Form.Field>

                  <Form.Field fluid="true">
                    <label>Auth password</label>
                    <input
                      placeholder="Last Name"
                      type="password"
                      name="AuthPassword"
                      required
                      onChange={handleChange}
                    />
                  </Form.Field>
                </Form.Group>
              )
            case "privateCertificate":
              return (
                <Form.Field>
                  <label>Upload private certificate</label>
                  <input
                    type="file"
                    name="AuthCertificate"
                    accept="text/*"
                    required
                    onChange={(e) => handleFileUpload(e)}
                  />
                </Form.Field>
              )
            default:
              return null
          }
        })()}
        {/* <Button positive type="submit">
          Submit
        </Button> */}
      </Form>
    </div>
  )
}

export default EditUserForm
