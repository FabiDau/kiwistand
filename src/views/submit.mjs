import htm from "htm";
import vhtml from "vhtml";

import Header from "./components/header.mjs";
import Footer from "./components/footer.mjs";
import Sidebar from "./components/sidebar.mjs";
import Head from "./components/head.mjs";
import Row, { extractDomain } from "./components/row.mjs";
import * as parser from "../parser.mjs";

const html = htm.bind(vhtml);

const ImageSVG = () => html`
  <svg
    style="width: 1.25rem; height: 1.25rem;"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 256 256"
  >
    <rect width="256" height="256" fill="none" />
    <rect
      x="40"
      y="40"
      width="176"
      height="176"
      rx="8"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="24"
    />
    <circle cx="96" cy="96" r="20" />
    <path
      d="M56.69,216,166.34,106.34a8,8,0,0,1,11.32,0L216,144.69"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="24"
    />
  </svg>
`;

export default async function submit(theme, url = "", title = "", identity) {
  if (url && !title) {
    let data;
    try {
      data = await parser.metadata(url);
    } catch (err) {
      // noop, if the request fails we just continue as though nothing ever happened.
    }
    if (data && data.ogTitle) {
      title = data.ogTitle;
    }
  }
  const path = "/submit";
  const story = {
    title: "Bitcoin: A Peer-to-Peer Electronic Cash System",
    href: "https://bitcoin.org/bitcoin.pdf",
    upvoters: [],
    avatars: [],
    timestamp: new Date() / 1000 - 60,
    identity: "0x00000000000000000000000000000000CafeBabe",
    displayName: "you",
  };
  const rowNumber = 0;
  const rowStyle =
    "overflow: hidden; max-width: 600px; min-height: 65px; padding: 1rem 1rem 0 1rem;";
  const interactive = true;
  return html`
    <html lang="en" op="news">
      <head>
        ${Head}
      </head>
      <body>
        <div class="container">
          ${Sidebar(path)}
          <div id="hnmain">
            <table border="0" cellpadding="0" cellspacing="0" bgcolor="#f6f6ef">
              <tr>
                ${await Header(theme, identity)}
              </tr>
              <tr>
                <td>
                  <p
                    style="color: black; padding: 10px 10px 0 10px; font-size: 12pt; font-weight: bold;"
                  >
                    Preview:
                  </p>
                </td>
              </tr>
              ${Row(rowNumber, null, rowStyle, interactive)(story)}
              <tr>
                <td>
                  <p
                    style="color: black; padding: 0 10px 0 10px; font-size: 12pt; font-weight: bold;"
                  >
                    Submission:
                  </p>
                </td>
              </tr>
              <tr>
                <td>
                  <form style="${formContainerStyle}">
                    <div style="${labelInputContainerStyle}">
                      <label for="title" style="${labelStyle}">Title:</label>
                      <div
                        contenteditable="true"
                        role="textbox"
                        aria-multiline="true"
                        id="titleInput"
                        name="title"
                        maxlength="80"
                        required
                        style="${editableContent}"
                        wrap="soft"
                        data-placeholder="Bitcoin: A Peer-to-Peer Electronic Cash System"
                        onpaste="
                          event.preventDefault();
                          const text = event.clipboardData.getData('text/plain');
                          document.execCommand('insertText', false, text);"
                      >
                        ${title}
                      </div>
                      <span style="font-size: 0.8rem;">
                        <span>Characters remaining: </span>
                        <span class="remaining">80</span></span
                      >
                    </div>
                    <div id="submit-button">
                      <div style="${labelInputContainerStyle}">
                        <label for="link" style="${labelStyle}">Link:</label>
                        <div style="display: flex; align-items: center;">
                          <input
                            placeholder="https://bitcoin.org/bitcoin.pdf"
                            id="urlInput"
                            type="text"
                            name="link"
                            size="50"
                            maxlength="2048"
                            required
                            style="${inputStyle}"
                            value="${url}"
                          />
                          <label style="${fileInputLabelStyle}">
                            <input
                              type="file"
                              style="${fileInputStyle}"
                              accept="image/*"
                              disabled
                            />
                            <${ImageSVG} />
                          </label>
                        </div>
                      </div>
                      <button
                        id="button-onboarding"
                        style="width: 100%;max-width: 600px;margin-top: 1rem;padding: 5px;font-size: 16px;cursor: pointer;"
                      >
                        Loading...
                      </button>
                    </div>
                  </form>
                </td>
              </tr>
              <tr>
                <td>
                  <div style="${previewContainerStyle}">
                    <div style="${previewStyle}" id="embed-preview"></div>
                  </div>
                </td>
              </tr>
            </table>
          </div>
        </div>
        ${Footer(theme)}
      </body>
    </html>
  `;
}
const submitButtonStyles = {
  width: "100%",
  maxWidth: "600px",
  marginTop: "1rem",
  padding: "5px",
  fontSize: "16px",
  cursor: "pointer",
};
const formContainerStyle = `
   display: flex;
   flex-direction: column;
   gap: 15px;
   margin: 0 auto;
   padding: 1rem 1rem;
 `;

const labelInputContainerStyle = `
   display: flex;
   flex-direction: column;
   gap: 5px;
   max-width: 600px;
 `;

const labelStyle = `
   font-size: 16px;
 `;

const inputStyle = `
   width: 100%;
   padding: 5px 10px;
   font-size: 16px;
   box-sizing: border-box;
   margin-right: 20px;
 `;

const buttonStyle = `
   width: 100%;
   max-width: 600px;
   margin-top: 0.5rem;
   padding: 5px;
   font-size: 16px;
   cursor: pointer;
 `;

const fileInputStyle = `
   display: none;
 `;

const fileInputLabelStyle = `
   width: 33px;
   height: 33px;
   display: flex;
   align-items: center;
   justify-content: center;
   background: grey;
   color: #fff;
   border-radius: 3px;
   cursor: pointer;
 `;

const editableContent = `
   overflow-wrap: anywhere;
   width: 100%;
   max-width: 600px;
   height: 55px;
   padding: 5px 10px;
   font-size: 16px;
   box-sizing: border-box;
   border: 1px solid #8f8f9d;
   overflow: auto;
   resize: both;
   white-space: pre-wrap;
   background-color: white;
   color: black;
   border-radius: 3px;
 `;

const previewContainerStyle = `
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  padding: 1rem 1rem;
`;

const previewStyle = `
  width: 100%;
  max-width: 600px;
  min-height: 450px;
  font-size: 16px;
  box-sizing: border-box;
`;
