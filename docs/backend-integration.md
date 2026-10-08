# Backend integration

The app currently composes a `MessengerService` with `LocalMessengerRepository` in `src/main.tsx`. Components subscribe to an immutable state snapshot through `useMessenger`; they do not call storage APIs.

## Existing persistence boundary

```ts
interface MessengerRepository {
  load(): Promise<MessengerState>;
  save(state: MessengerState): Promise<void>;
}
```

An adapter can perform HTTP requests without changing the component contract. Construct the service with `await MessengerService.create(adapter)`. Repository rejections propagate to the UI, and failed changes are not published. The application serializes writes, so asynchronous saves within one instance cannot race.

The snapshot interface deliberately keeps the demo small. Do not persist an entire shared conversation snapshot from several clients: the last writer could erase another person's messages. Local serialization is not a distributed concurrency solution.

## Suggested production ports

Before adding live users, split remote operations into narrow interfaces:

- `SessionGateway`: sign in, sign out, refresh session and observe auth changes.
- `ContactRepository`: list, add, update, block and remove contacts for the current user.
- `MessageRepository`: paginated history and idempotent message insertion.
- `ConversationEvents`: subscribe/unsubscribe to messages, typing and presence.
- `AttachmentStorage`: upload and obtain authorized downloads.

Retain pure validation and view components. Inject these ports into application services and translate their results into the existing UI models. Replace `useDemoReplies` with a subscription adapter, and route incoming events through a deduplicating application use case.

## Supabase implementation outline

1. Add the SDK only inside infrastructure and configure it at the composition root.
2. Replace local profile selection with real authentication and session restoration.
3. Create profiles, contacts, conversations, conversation_members and messages tables.
4. Protect rows with policies that require membership and derive identity from the authenticated session.
5. Use unique client-generated message IDs for retry deduplication; let the server assign authoritative timestamps.
6. Publish incoming messages through Realtime subscriptions, with cleanup on sign-out or unmount.
7. Move attachments to Storage and persist metadata instead of data URLs; authorize uploads/downloads.
8. Add loading, retry and delivery states, pagination, reconnect handling and multi-client conflict tests.

Never put a service-role key in a browser bundle. Public client configuration belongs in environment variables; authorization belongs on the server. The demo's `signedIn` field and contact email are not identity proofs.

## Adapter validation

Use a fake asynchronous adapter to verify delays and failures without backend credentials. Existing `StateStore` tests cover serialized saves and recovery after a rejected write. Add integration tests against a disposable backend for authorization boundaries, real events, retries, attachment access and two simultaneous clients.

Keep remote migrations and adapters in focused files below the 150-line limit. Extend the automated line check only for generated artifacts, not application code.
