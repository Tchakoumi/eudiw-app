# storage

This library was generated with [Nx](https://nx.dev) with purpose of building a service module for data storage and retrieval.

Considering the nature of PWAs been browser applications, access to device storage cannot be done directly. PWAs thought acting like native applications can only make use of browser storage for any relative use case. This said, our goal here is to provide a default interface module and implementation that writes to the browser storage options we'ld have chosen. 
As any other web application, the following are the possible ways to store data on a PWA each with its own characteristics and use cases. Here are some of the common options:

1. **LocalStorage:** localStorage allows you to store key-value pairs in the client's web browser. It's synchronous, meaning it can potentially block the main thread, so it's best suited for small amounts of data (usually limited to 5-10 MB per domain). Data stored in localStorage persists even after the browser is closed and reopened.

2. **SessionStorage:** sessionStorage is similar to localStorage but scoped to the current session. Data stored in sessionStorage is cleared when the browser tab is closed. Like localStorage, it's synchronous and suitable for storing small amounts of data.

3. **IndexedDB:** IndexedDB is a low-level API for client-side storage of significant amounts of structured data. It's designed for storing larger amounts of data asynchronously, making it suitable for more complex applications. IndexedDB supports transactions and indexing, allowing for efficient querying and retrieval of data.

4. **Cookies:** Cookies are small pieces of data sent from a website and stored on the user's device. They have various uses, including session management, tracking, and storing user preferences. However, cookies have limitations in terms of storage size (usually limited to 4KB per cookie) and are transmitted with every HTTP request, which can impact performance.

5. **Web Storage API:** The Web Storage API encompasses both localStorage and sessionStorage, providing a simple interface for storing data on the client's device. It's widely supported across modern web browsers and offers a straightforward way to persist data between page loads.

6. **Cache API:** The Cache API allows you to store responses from network requests in the browser's cache. It's commonly used in Progressive Web Apps (PWAs) to cache static assets and API responses for offline access and improved performance.

7. **Service Workers:** Service workers are a powerful feature of modern web browsers that run in the background, separate from web pages, and can intercept network requests. They can be used to implement advanced caching strategies, handle offline scenarios, and even synchronize data with a server when the network connection is available.

8. **Third-party Storage Solutions:** There are also third-party storage solutions and databases that can be used in web applications, such as Firebase Realtime Database, Firestore, and other cloud-based databases. These solutions offer scalability, real-time synchronization, and other advanced features but may require integration with third-party services.

IndexedDB seems to be the most fitting choice for our use case, primarily because of its support for structured data, larger storage capacity, transactions, and indexing, but above all, its asynchronous nature.

## Usage
To use this libray in the app, first import
```ts
import { StorageService } from '@datev/storage'
```



## Running unit tests

Run `nx test storage` to execute the unit tests via [Jest](https://jestjs.io).
