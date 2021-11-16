import React, { useState, useEffect, useRef } from "react"
import { Dimmer, Loader  } from "semantic-ui-react"
// mobx
import { observer } from 'mobx-react'
import {
  Icon,
  Grid,
  Header,
  Modal,
  Button,
  Segment,
  Container,
} from "semantic-ui-react"
import EditUserForm from "../componentsNew/EditUserForm"
import { store } from "services/state"
import _ from "lodash"
import * as AccountService from "services/accounts"

const UserProfile = observer(() => {
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState({})
  const [keyVisible, setKeyVisible] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)
  const [allAccounts, setAllAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedAccount, setSelectedAccount] = useState(undefined)

  const refreshAccounts = () => 
    AccountService.fetchRegisteredAccounts().then((accounts) => {
        setLoading(true)
        const userEmail = _.get(store, "user.email")
      //console.log("userEmail", userEmail)
      setAllAccounts(_.map(accounts))
      //console.log("accounts", accounts) 
      accounts.forEach((account) => {
        if (account.EmailAddress === userEmail) {
          setSelectedAccount(account)
        //   console.log("store", store)
        //   console.log("store email", store.user.email)
        //   console.log("selectedAccount", selectedAccount)
        }
      })
    })



  // Initial load
  useEffect(() => {
    refreshAccounts().finally(() => {
        setLoading(false)
        //console.log("allAccounts", allAccounts)
    })
  }, [])
//   let userEmail = store.user.email
//   console.log("all accounts", allAccounts)
//   user = allAccounts.find((account) => account.EmailAddress === userEmail)
//   console.log("user", user)


  const handleKeyVisible = () => {
    setKeyVisible(!keyVisible)
  }
  const handleKeyCopy = () => {
    navigator.clipboard.writeText(store.apiKey)
    setCopySuccess(true)
    setTimeout(() => {
      setCopySuccess(false)
    }, 2000)
  }

  //   useEffect(() => {
  //     let mounted = true
  //     getList().then((items) => {
  //       if (mounted) {
  //         setList(items)
  //       }
  //     })
  //     return () => (mounted = false)
  //   }, [])

  return (
    <div>
      <Container>
        <div style={{ padding: "20px 0 0 50px" }}>
          <Header as="h3" textAlign="left">
            <Icon name="settings" />
            <Header.Content>
              Account Settings 
              <Header.Subheader>Manage your preferences</Header.Subheader>
            
            </Header.Content>
          </Header>
        </div>
        {loading ? ( <Dimmer active inverted>
        <Loader size='large'>Loading...</Loader>
      </Dimmer>) : (
        <Segment color="green">
          <Grid textAlign="center">
            <Grid.Row>
              <Grid.Column width={8}>
                <Header size="small">First Name:</Header>
                <p>{selectedAccount.FirstName ? selectedAccount.FirstName : "Fabio"}</p>
              </Grid.Column>
              <Grid.Column width={8}>
                <Header size="small">Last Name:</Header>
                <p>{selectedAccount.LastName ? selectedAccount.LastName : "Santos"}</p>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width={8}>
                <Header size="small">Enabled MFA:</Header>
                <p>{selectedAccount.Mfa ? selectedAccount.Mfa : "False"}</p>
              </Grid.Column>
              <Grid.Column width={8}>
                <Header size="small">Phone Number:</Header>
                <p>{selectedAccount.PhoneNumber ? selectedAccount.PhoneNumber : "+1234567890"}</p>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width={8}>
                <Header size="small">Email Address:</Header>
                <p>{selectedAccount.EmailAddress ? selectedAccount.EmailAddress : "fabio.santos@outscope.com"}</p>
              </Grid.Column>
              <Grid.Column width={8}>
                <Header size="small">Key Duration:</Header>
                <p>{selectedAccount.ApiKeyDuration? selectedAccount.ApiKeyDuration : "90 Days"}</p>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width={8}>
                <Header size="small">API Key ID:</Header>
                <p>{selectedAccount.ApiKeyId? selectedAccount.ApiKeyId : "pibiady3nl"}</p>
              </Grid.Column>
              <Grid.Column width={8}>
                <Header size="small">API Key Secret:</Header>
                <div>
                  <p>{keyVisible ? store.apiKey : <b>******************</b>}</p>
                  <Icon
                    name="eye slash outline"
                    style={{ cursor: "pointer" }}
                    onClick={handleKeyVisible}
                  />
                  <Icon
                    name="copy"
                    onClick={handleKeyCopy}
                    style={{ cursor: "pointer", color: "#058052" }}
                  />
                  {copySuccess ? (
                    <span style={{ color: "#01bf71" }}>
                      <b>Success!</b>
                    </span>
                  ) : null}
                </div>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width={8}>
                <Header size="small">MNO:</Header>
                <p>{selectedAccount.Mno ? selectedAccount.Mno : "Vodafone"}</p>
              </Grid.Column>
              <Grid.Column width={8}>
                <Header size="small">MNO Location:</Header>
                <p>{selectedAccount.MnoLocation ? selectedAccount.MnoLocation : "Portugal"}</p>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width={8}>
                <Header size="small">Callback URL</Header>
                <p>{selectedAccount.CallBackUrl ? selectedAccount.CallBackUrl : "https://outscope.com"}</p>
              </Grid.Column>
              <Grid.Column width={8}>
                <Header size="small">Callback Type:</Header>
                <p>{selectedAccount.Type ? selectedAccount.Type : "Api Key"}</p>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>) }
        <div style={{ textAlign: "right" }}>
          <Modal
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            open={open}
            trigger={<Button>Edit Profile</Button>}
          >
            <Modal.Header>Edit Profile</Modal.Header>
            <Modal.Content>
              <Modal.Description>
                <p style={{ padding: "10px" }}>
                  You can update your Key, Phone Number, MNO options, Callback
                  Url and other available fields.
                </p>
              </Modal.Description>
              <EditUserForm />
            </Modal.Content>
            <Modal.Actions>
              <Button color="black" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                content="Yes, update"
                labelPosition="right"
                icon="checkmark"
                onClick={() => setOpen(false)}
                positive
              />
            </Modal.Actions>
          </Modal>
        </div>
      </Container>
    </div>
  )
})

export default UserProfile
