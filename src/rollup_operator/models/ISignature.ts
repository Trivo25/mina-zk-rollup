import EnumSignatureType from './EnumSignatureType';
interface ISignature {
  publicKey: string;
  signature: {
    field: string;
    scalar: string;
  };
  type: EnumSignatureType;
  payload: string;
}

export default ISignature;

/*
Example payload    
{
  "publicKey": "B62qmNsne47XJamGRsmckG6L16QZu7cGCA7avTEi4zCzPzxmmXgAj7w",
  "signature": {
    "field": "7797250386283974212481778052523307015056807928189716961253856328756529747873",
    "scalar": "7843613972680634670880673355411715345749981823944101735387873769093458498464"
  },
  "type": "plain",
  "payload": "{\"message\":\"Hello\"}"
}
*/
