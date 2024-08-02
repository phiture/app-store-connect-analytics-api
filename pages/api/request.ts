import {NextApiRequest, NextApiResponse} from 'next';
import axios from 'axios';
import generateAscToken from "@/components/GenerateAscToken";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        const {appId, accessType, issuerId, keyId, keyContents} = req.body;

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
                res.status(500).json({error: error.message});
            } else {
                res.status(500).json({error: "An unknown error occurred"});
            }
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
};
