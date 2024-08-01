import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import axios from 'axios';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { appId, accessType, issuerId, keyId, keyContents } = req.body;

    const generateAscToken = (issuerId: string, keyId: string, privateKey: string): string => {
      const expirationMinutes = 20;
      const expirationTime = Math.min(expirationMinutes, 20);
      const exp = Math.floor(Date.now() / 1000) + (expirationTime * 60);

      const payload = {
        iss: issuerId,
        iat: Math.floor(Date.now() / 1000),
        exp: exp,
        aud: "appstoreconnect-v1"
      };

      const token = jwt.sign(payload, privateKey, { algorithm: 'ES256', header: { alg: "ES256", kid: keyId, typ: "JWT" } });
      return token;
    };

    try {
      const token = generateAscToken(issuerId, keyId, keyContents);
      const response = await axios.post(
        "https://api.appstoreconnect.apple.com/v1/analyticsReportRequests",
        {
          data: {
            type: "analyticsReportRequests",
            attributes: {
              appStoreVersion: {
                data: {
                  accessType: accessType
                }
              }
            },
            relationships: {
              app: {
                data: {
                  type: "apps",
                  id: appId
                }
              }
            }
          }
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      res.status(200).json(response.data);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: "An unknown error occurred" });
      }
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
