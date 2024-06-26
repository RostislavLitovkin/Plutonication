// css wrapper is needed for prettier formatting
// install: https://marketplace.visualstudio.com/items?itemName=Tobermory.es6-string-html
const css = String.raw;

const plutonicationModalStyle = css`
.plutonication__component {
  display: none;
  /* Changes to flex */
  justify-content: center;
  align-items: center;
  font-family: sans-serif;
  background-color: #0e111066;
  color: #242529;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  position: fixed;
  z-index: 99999999;
  pointer-events: auto;
}

.plutonication__component-override-styles {
  display: flex;
  padding: 0;
  background-color: white;
  font-size: 12px;
}

.plutonication__component>div {
  background-color: #0e1110;
  border-radius: 5px;
  width: 320px;
  align-items: center;
  padding: 20px;
  border-radius: 1rem;
}

.plutonication__component>div .plutonication__header {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 50px;
  margin-bottom: 10px;
  align-items: center;
  justify-content: center;
}

.plutonication__component>div .plutonication__header .plutonication__title {
  color: #fff;
  font-weight: bold;
  font-size: 20px;

  position: fixed;
  bottom: auto;
  right: auto;
  left: auto;
  top: auto;
}

.plutonication__component>div .plutonication__header .plutonication__back {
  position: relative;
  margin-left: auto;
}

.plutonication__component>div .plutonication__header .plutonication__back:hover,
.plutonication__component>div .plutonication__header .plutonication__back:focus {
  cursor: pointer;
}

.plutonication__component .plutonication__qr-code {
  height: 260px;
  width: 260px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.plutonication__component .plutonication__qr-code img {
  border-radius: 10px;
  display: block;
  background-color: #fff;
}

.plutonication__component .plutonication__supported-wallets-header {
  font-size: 16px;
  color: white;
  margin-bottom: 10px;
}

.plutonication__component .plutonication__wallets-content {
  width: 310px;
  height: 112px;
  display: grid;
  grid-template-columns: repeat(4, 70px);
  column-gap: 10px;
  margin: 5px, 0px, 5px, 20px;
}

.plutonication__component .plutonication__all-wallets-content {
  height: 400px;
  overflow-y: scroll;
  overflow-x: hidden;
  row-gap: 10px;
  scrollbar-width: none;
  margin-bottom: 20px;
}

.plutonication__component .plutonication__all-wallets-content::-webkit-scrollbar {
  width: none; /* Width of the scrollbar */
}

.plutonication__component .plutonication__qr-code .plutonication__connection-status {
  color: red;
}

.plutonication__component .plutonication__qr-code .plutonication__message {
  color: white;
}

.plutonication__component .plutonication__wallets-button-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  height: 270px;
  width: 270px;
  margin-left: auto;
  margin-right: auto;
}

.plutonication__component .plutonication__wallets-button-container .plutonication__download-wallet {
  cursor: pointer;
}

.plutonication__component .plutonication__wallets-button-container .plutonication__disabled {
  filter: brightness(50%);
  cursor: not-allowed;
}

.plutonication__component .plutonication__social-media-container {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.plutonication__component .plutonication__social-media-container>a:first-of-type {
  text-decoration: none;
  color: #fff;
}

.plutonication__component .plutonication__social-media-container a {
  margin-left: 10px;
}
`

export default plutonicationModalStyle
