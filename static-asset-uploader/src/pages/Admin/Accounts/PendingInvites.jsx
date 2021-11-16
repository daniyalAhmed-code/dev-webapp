import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";
import {
  Form,
  Button,
  Container,
  Header,
  Message,
  Modal,
} from "semantic-ui-react";
import axios from "axios";


import * as MessageList from "components/MessageList";
import * as AccountService from "services/accounts";
import * as AccountsTable from "components/Admin/Accounts/AccountsTable";
import * as AccountsTableColumns from "components/Admin/Accounts/AccountsTableColumns";

import { useBoolean } from "utils/use-boolean";

const PendingInvites = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAccount, setSelectedAccount] = useState(undefined);
  const [isCreateModalOpen, openCreateModal, closeCreateModal] =
    useBoolean(false);
  const [isDeleteModalOpen, openDeleteModal, closeDeleteModal] =
    useBoolean(false);
  const [messages, sendMessage] = MessageList.useMessages();
  const [
    createModalMessages,
    sendCreateModalMessage,
    clearCreateModalMessages,
  ] = MessageList.useMessages();

  const refreshAccounts = () =>
    AccountService.fetchPendingInviteAccounts().then((accounts) =>
      setAccounts(accounts)
    );

  // Initial load
  useEffect(() => {
    refreshAccounts().finally(() => setLoading(false));
  }, []);

  const onSelectAccount = useCallback(
    (account) => setSelectedAccount(account),
    []
  );

  const onConfirmCreate = useCallback(
    async (emailAddress) => {
      setLoading(true);
      clearCreateModalMessages();
      try {
        await AccountService.createInviteByEmail(emailAddress);
      } catch (error) {
        sendCreateModalMessage((dismiss) => (
          <CreateFailureMessage
            emailAddress={emailAddress}
            dismiss={dismiss}
            errorMessage={error.message}
          />
        ));
        setLoading(false);
        return false;
      }
      closeCreateModal();
      clearCreateModalMessages();
      sendMessage((dismiss) => (
        <CreateSuccessMessage emailAddress={emailAddress} dismiss={dismiss} />
      ));
      // Don't need to wait for this
      refreshAccounts().then(() => setLoading(false));
      return true;
    },
    [
      sendMessage,
      sendCreateModalMessage,
      clearCreateModalMessages,
      closeCreateModal,
    ]
  );

  const onConfirmResend = useCallback(async () => {
    setLoading(true);
    try {
      await AccountService.resendInviteByEmail(selectedAccount.EmailAddress);
      sendMessage((dismiss) => (
        <ResendSuccessMessage account={selectedAccount} dismiss={dismiss} />
      ));
    } catch (error) {
      sendMessage((dismiss) => (
        <ResendFailureMessage account={selectedAccount} dismiss={dismiss} />
      ));
    } finally {
      setLoading(false);
    }
  }, [sendMessage, selectedAccount]);

  const onConfirmDelete = useCallback(async () => {
    setLoading(true);
    closeDeleteModal();
    try {
      await AccountService.deleteInviteByUserId(selectedAccount.UserId);
      sendMessage((dismiss) => (
        <DeleteSuccessMessage account={selectedAccount} dismiss={dismiss} />
      ));
      await refreshAccounts();
    } catch (error) {
      sendMessage((dismiss) => (
        <DeleteFailureMessage
          account={selectedAccount}
          dismiss={dismiss}
          errorMessage={error.message}
        />
      ));
    } finally {
      setLoading(false);
    }
  }, [sendMessage, selectedAccount, closeDeleteModal]);

  return (
    <Container fluid style={{ padding: "2em" }}>
      <Header as="h1">Pending invites</Header>
      <MessageList.MessageList messages={messages} />
      <AccountsTable.AccountsTable
        accounts={accounts}
        columns={[
          AccountsTableColumns.EmailAddress,
          AccountsTableColumns.DateInvited,
          AccountsTableColumns.Inviter,
        ]}
        loading={loading}
        selectedAccount={selectedAccount}
        onSelectAccount={onSelectAccount}
      >
        <TableActions
          canCreate={!loading}
          onClickCreate={openCreateModal}
          canResend={!loading && selectedAccount}
          onClickResend={onConfirmResend}
          canDelete={!loading && selectedAccount}
          onClickDelete={openDeleteModal}
        />
      </AccountsTable.AccountsTable>
      <CreateInviteModal
        onConfirm={onConfirmCreate}
        open={isCreateModalOpen}
        onClose={closeCreateModal}
        messages={createModalMessages}
      />
      <DeleteInviteModal
        account={selectedAccount}
        onConfirm={onConfirmDelete}
        open={isDeleteModalOpen}
        onClose={closeDeleteModal}
      />
    </Container>
  );
};
export default PendingInvites;

const TableActions = ({
  canCreate,
  onClickCreate,
  canResend,
  onClickResend,
  canDelete,
  onClickDelete,
}) => (
  <Button.Group>
    <Button
      content="Create user..."
      disabled={!canCreate}
      onClick={onClickCreate}
    />
    <Button content="Resend" disabled={!canResend} onClick={onClickResend} />
    <Button content="Delete" disabled={!canDelete} onClick={onClickDelete} />
  </Button.Group>
);

// Pulled from https://html.spec.whatwg.org/multipage/input.html#e-mail-state-(type%3Demail) and
// optimized in a few ways for size:
// - Classes of `[A-Za-z0-9]` were shortened to the equivalent `[^_\W]`.
// - Other instances of `0-9` in classes were converted to the shorthand `\d`.
// - The whole regexp was made case-insensitive to avoid the need for `A-Za-z` in classes.
// - As we're only testing, I replaced all the non-capturing groups with capturing ones.
const validEmailRegex =
  /^[\w.!#$%&'*+/=?^`{|}~-]+@[^_\W]([a-z\d-]{0,61}[^_\W])?(\.[^_\W]([a-z\d-]{0,61}[^_\W])?)*$/i;

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
];

/*
 * Note: `onConfirm` should return a boolean indicating whether the creation
 * succeeded.
 */
const CreateInviteModal = ({ onConfirm, open, onClose, messages }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const isEmailValid = useMemo(() => validEmailRegex.test(email), [email]);
  const onChangeEmailAddress = useCallback(
    (_event, { value }) => setEmail(value),
    []
  );
  // const onClickCreate = useCallback(async () => {
  //   setLoading(true)
  //   try {
  //     if (await onConfirm(email)) {
  //       setEmail('')
  //     }
  //   } finally {
  //     setLoading(false)
  //   }
  // }, [onConfirm, email])

  // If the user stops typing, but the email is invalid, show the invalid email message as a hint
  // for why they can't proceed. Don't make the timeout so short that it'd annoy a slow typer,
  // though.
  const [needsAssistance, setNeedsAssistance] = useState(false);
  const emailEverSet = useRef(false);

  useEffect(() => {
    if (email) emailEverSet.current = true;
    if (isEmailValid) {
      setNeedsAssistance(false);
    } else if (!needsAssistance && emailEverSet.current) {
      const timer = setTimeout(() => {
        setNeedsAssistance(true);
      }, 3000 /* ms */);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [email, needsAssistance, isEmailValid]);

  // state for callBackUrl
  const [formImages, setFormImages] = useState({
    profileImage: "",
    AuthCertificate: "",
  });
  const [authType, setAuthType] = useState("");
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
  });
  //state for Api Response
  const [apiResponse, setApiResponse] = useState({
    loaded: false,
    type: "",
    message: "",
    color: ""
  });
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
        };
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
        };
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
        };
      default:
        return null;
    }
  };
  //const postUrl = "/prod/admin/accounts";
  //const createUserAxios = (userData) => axios.post(postUrl, userData);
  const onCreateUser = async (apidata) => {
    try {
      await AccountService.createUserByForm(apidata);
      setApiResponse({
        loaded: true,
        type: "success",
        message: "success: usercreated",
        color: "green"
      })
    } catch (error) {
      setApiResponse({
        loaded: true,
        type: "Error",
        message: error.message,
        color: "red"
      })
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      }
      fileReader.onerror = (error) => {
        reject(error)
      }
    })
  }
 const handleFileUpload = async (e) => {
   const file = e.target.files[0];
   const name = e.target.name;
   const base64 = await convertToBase64(file);
   setFormImages({ ...formImages, [name]: base64 });
 }

  const handleAuthType = (e, { value }) => {
    setAuthType(value);
    setValues({ ...values, type: value });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(values);
    console.log(createUserData(values))
    const data = createUserData(values)
    onCreateUser(data)
  }

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  }

  return (
    <Modal open={open} onClose={onClose} size={"small"}>
      <Modal.Header>Create User</Modal.Header>
      <Modal.Content>
        <p>
          Enter the details below and select <strong>Create</strong> to create a
          new user account.
        </p>
        <MessageList.MessageList messages={messages} />
        <Message hidden={!needsAssistance || isEmailValid || loading} warning>
          Please enter a valid email address.
        </Message>
        {apiResponse.loaded && (
          <Message color={apiResponse.color}>{apiResponse.message}</Message>
        )}
        <Form id="UserForm" onSubmit={handleSubmit}>
          <Form.Group widths="equal">
            <Form.Field>
              <label>First Name</label>
              <input
                placeholder="First Name"
                type="text"
                name="targetFirstName"
                required
                onChange={handleChange}
              />
            </Form.Field>

            <Form.Field>
              <label>Last Name</label>
              <input
                placeholder="Last Name"
                type="text"
                name="targetLastName"
                required
                onChange={handleChange}
              />
            </Form.Field>
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Field>
              <label>Profile Image</label>
              <input
                type="file"
                name="profileImage"
                accept="image/png, image/gif, image/jpeg"
                onChange={(e) => handleFileUpload(e)}
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
                onChange={handleChange}
                required
              />
            </Form.Field>
            <Form.Field>
              <label> Email Address </label>
              <input
                placeholder="Email address"
                type="email"
                name="targetEmailAddress"
                onChange={handleChange}
                pattern="^[\w.!#$%&'*+/=?^`{|}~-]+@[^_\W]([a-z\d-]{0,61}[^_\W])?(\.[^_\W]([a-z\d-]{0,61}[^_\W])?)*$"
                required
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
                <option key="default" value="">
                  {" "}
                  -- select MNO --{" "}
                </option>
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
                <option key="default" value="">
                  -- select MNO Location --
                </option>
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
                      onChange={handleChange}
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
                        onChange={handleChange}
                      />
                    </Form.Field>

                    <Form.Field fluid="true">
                      <label>Auth password</label>
                      <input
                        placeholder="Last Name"
                        type="password"
                        name="AuthPassword"
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
                      onChange={(e) => handleFileUpload(e)}
                    />
                  </Form.Field>
                )
              default:
                return null
            }
          })()}
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={onClose}>Cancel</Button>
        <Button positive type="submit" form="UserForm">
          Create
        </Button>
      </Modal.Actions>
    </Modal>
  )
};

const DeleteInviteModal = ({ account, onConfirm, open, onClose }) =>
  account ? (
    <Modal size="small" open={open} onClose={onClose}>
      <Modal.Header>Confirm invite deletion</Modal.Header>
      <Modal.Content>
        <p>
          Are you sure you want to delete this account invite for{" "}
          <strong>{account.EmailAddress}</strong>? This action is irreversible.
        </p>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={onClose}>Cancel</Button>
        <Button negative onClick={onConfirm}>
          Delete
        </Button>
      </Modal.Actions>
    </Modal>
  ) : null;

const CreateSuccessMessage = ({ emailAddress, dismiss }) => (
  <Message onDismiss={dismiss} positive>
    <Message.Content>
      Sent account invite to <strong>{emailAddress}</strong>.
    </Message.Content>
  </Message>
);


const CreateFailureMessage = ({ emailAddress, errorMessage, dismiss }) => (
  <Message onDismiss={dismiss} negative>
    <Message.Content>
      <p>
        Failed to send account invite to <strong>{emailAddress}</strong>.
      </p>
      {errorMessage && <p>Error message: {errorMessage}</p>}
    </Message.Content>
  </Message>
);

const ResendSuccessMessage = ({ account, dismiss }) => (
  <Message onDismiss={dismiss} positive>
    <Message.Content>
      Resent account invite to <strong>{account.EmailAddress}</strong>.
    </Message.Content>
  </Message>
);

const ResendFailureMessage = ({ account, errorMessage, dismiss }) => (
  <Message onDismiss={dismiss} negative>
    <Message.Content>
      <p>
        Failed to resend account invite to{" "}
        <strong>{account.EmailAddress}</strong>.
      </p>
      {errorMessage && <p>Error message: {errorMessage}</p>}
    </Message.Content>
  </Message>
);

const DeleteSuccessMessage = ({ account, dismiss }) => (
  <Message onDismiss={dismiss} positive>
    <Message.Content>
      Deleted account invite for <strong>{account.EmailAddress}</strong>.
    </Message.Content>
  </Message>
);

const DeleteFailureMessage = ({ account, errorMessage, dismiss }) => (
  <Message onDismiss={dismiss} negative>
    <Message.Content>
      <p>
        Failed to delete account invite for{" "}
        <strong>{account.EmailAddress}</strong>.
      </p>
      {errorMessage && <p>Error message: {errorMessage}</p>}
    </Message.Content>
  </Message>
);
