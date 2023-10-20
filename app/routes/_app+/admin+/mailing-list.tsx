import { XMarkIcon } from "@heroicons/react/24/outline";
import { Form, useLoaderData } from "@remix-run/react";
import type { ActionFunction, LoaderFunction } from "@remix-run/server-runtime";
import { mg } from "#app/libs/email/config.ts";
import { removeSubscriber } from "#app/models/user.server.ts";

type Subscriber = {
  address: string;
  name: string;
  subscribed: boolean;
  vars: { [ key: string ]: string };
};

export const loader: LoaderFunction = async ({ request }) => {
  const subscriberList = process.env.MAILGUN_SUBSCRIBER_LIST;
  if (!subscriberList) {
    console.error("MAILGUN_SUBSCRIBER_LIST is not set");
    return {};
  }
  try {
    const subscribers = await mg().lists.members.listMembers(subscriberList);
    return { subscribers: subscribers.items };
  } catch (error) {
    console.error(error);
  }
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const address = formData.get("address");
  if (typeof address !== "string") {
    throw new Error("No address provided");
  }
  try {
    await removeSubscriber(address);
  } catch (error) {
    console.error(error);
  }
  return null;
};

export default function MailingList() {
  const { subscribers } = useLoaderData<{ subscribers: Subscriber[] }>();
  return (
    <div className="flex h-full flex-col">
      <main className="h-full bg-white">
        <div className="h-full bg-gray-50 p-4">
          <div className="block text-xl text-blue-500">Subscribers</div>
          <div className="mt-4">
            {subscribers?.map((subscriber) => (
              <div key={subscriber.address} className="group w-1/4">
                <div className="flex">
                  <strong>{subscriber.name}</strong>
                  <div className="ml-auto">
                    <Form method="post">
                      <input
                        type="hidden"
                        name="address"
                        value={subscriber.address}
                      />
                      <button
                        type="submit"
                        className="btn btn-sm btn-danger text-transparent group-hover:text-red-500"
                      >
                        <XMarkIcon className="inline-block h-6 w-6" />
                      </button>
                    </Form>
                  </div>
                </div>
                <div>
                  <small>{subscriber.address}</small>
                </div>
                <div>
                  <small>
                    {subscriber.subscribed ? "Subscribed" : "Not Subscribed"}
                  </small>
                </div>
                <div>
                  <small>
                    {Object.keys(subscriber.vars).map((key) => (
                      <div key={key}>
                        <strong>{key}</strong>: {subscriber.vars[ key ]}
                      </div>
                    ))}
                  </small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
