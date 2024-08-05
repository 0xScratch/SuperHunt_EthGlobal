import { createThirdwebClient } from "thirdweb";

const clientID = process.env.NEXT_PUBLIC_CLIENT_ID;

if (!clientID) {
    throw new Error('No client ID found');
}

export const client = createThirdwebClient({
    clientId: clientID,
})