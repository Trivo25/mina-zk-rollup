import { Bool } from 'snarkyjs';

export { Permission };

const True = () => Bool(true);
const False = () => Bool(false);

type Permission = {
  constant: Bool;
  signatureNecessary: Bool;
  signatureSufficient: Bool;
};

// eslint-disable-next-line no-redeclare
let Permission = {
  impossible: (): Permission => ({
    constant: True(),
    signatureNecessary: True(),
    signatureSufficient: False(),
  }),

  none: (): Permission => ({
    constant: True(),
    signatureNecessary: False(),
    signatureSufficient: True(),
  }),

  proof: (): Permission => ({
    constant: False(),
    signatureNecessary: False(),
    signatureSufficient: False(),
  }),

  signature: (): Permission => ({
    constant: False(),
    signatureNecessary: True(),
    signatureSufficient: True(),
  }),

  proofOrSignature: (): Permission => ({
    constant: False(),
    signatureNecessary: False(),
    signatureSufficient: True(),
  }),

  toString(
    p: Permission
  ): 'Signature' | 'Proof' | 'Either' | 'None' | 'Impossible' | undefined {
    if (p.constant && p.signatureNecessary && !p.signatureSufficient)
      return 'Impossible';

    if (p.constant && !p.signatureNecessary && p.signatureSufficient)
      return 'None';

    if (!p.constant && !p.signatureNecessary && !p.signatureSufficient)
      return 'Proof';

    if (!p.constant && p.signatureNecessary && p.signatureSufficient)
      return 'Signature';

    if (!p.constant && !p.signatureNecessary && p.signatureSufficient)
      return 'Either';

    return undefined;
  },
};
