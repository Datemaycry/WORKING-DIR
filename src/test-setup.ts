// Provides all IDB globals (indexedDB, IDBKeyRange, IDBFactory, etc.) in Node test env.
// DB isolation is still ensured per-test via resetDBConnection(new IDBFactory()).
import 'fake-indexeddb/auto'
