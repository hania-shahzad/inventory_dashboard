import { Component } from "react";

const STORAGE_KEY = "inventory-audit-logs";
const MAX_LOGS = 50;
const TOAST_DURATION_MS = 3000;

/**
 * AuditLogger - CLASS COMPONENT (Task 3)
 * --------------------------------------
 * Records every inventory operation (added / updated / deleted) in an audit trail.
 * The parent (App) passes the most recent operation through the `latestEvent` prop.
 * Local logger state lives in this.state and is changed ONLY with this.setState().
 *
 * Lifecycle methods used:
 *  - constructor()            : initial state + method binding
 *  - componentDidMount()      : load saved logs from localStorage, add global listener
 *  - componentDidUpdate()     : react to new events, persist logs, show toast
 *  - componentWillUnmount()   : clear timers and remove listeners (cleanup)
 */
class AuditLogger extends Component {
  constructor(props) {
    super(props);

    // Local state of the logger (class components use this.state)
    this.state = {
      logs: [], // array of { id, type, message, time }
      toast: null, // currently visible toast (or null)
    };

    this.toastTimer = null; // handle for the toast timeout, cleared on unmount

    // Class methods that are used as event handlers must be bound to `this`
    this.handleClear = this.handleClear.bind(this);
    this.handleStorageEvent = this.handleStorageEvent.bind(this);
  }

  /** Reads logs from localStorage safely. */
  readStoredLogs() {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  /**
   * componentDidMount: runs ONCE after the first render.
   * Perfect place for side effects such as reading storage and subscribing to events.
   */
  componentDidMount() {
    // 1) Retrieve the initial audit logs stored in the browser
    this.setState({ logs: this.readStoredLogs() });

    // 2) Subscribe to a global event: keeps logs in sync if another tab changes them
    window.addEventListener("storage", this.handleStorageEvent);
  }

  /**
   * componentDidUpdate: runs after EVERY update (props or state change).
   * Every setState here is wrapped in a condition to avoid infinite loops.
   */
  componentDidUpdate(prevProps, prevState) {
    const { latestEvent } = this.props;

    // A) New inventory operation arrived from the parent -> add it to the log + show toast
    if (latestEvent && latestEvent !== prevProps.latestEvent) {
      const entry = {
        id: latestEvent.id,
        type: latestEvent.type,
        message: latestEvent.message,
        time: new Date().toISOString(),
      };

      this.setState((state) => ({
        logs: [entry, ...state.logs].slice(0, MAX_LOGS), // newest first, capped length
        toast: entry,
      }));

      // Auto-hide the toast; clear any earlier timer first so timers never pile up
      clearTimeout(this.toastTimer);
      this.toastTimer = setTimeout(() => this.setState({ toast: null }), TOAST_DURATION_MS);
    }

    // B) Logs changed -> persist them to localStorage
    if (prevState.logs !== this.state.logs) {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state.logs));
      } catch {
        /* storage unavailable - ignore */
      }
    }
  }

  /**
   * componentWillUnmount: runs just BEFORE the component is removed.
   * Clean up everything started in componentDidMount/componentDidUpdate
   * to prevent memory leaks and "setState on an unmounted component".
   */
  componentWillUnmount() {
    clearTimeout(this.toastTimer);
    window.removeEventListener("storage", this.handleStorageEvent);
  }

  handleStorageEvent(event) {
    // Another browser tab updated the logs -> mirror them here
    if (event.key === STORAGE_KEY) {
      this.setState({ logs: this.readStoredLogs() });
    }
  }

  handleClear() {
    this.setState({ logs: [] });
  }

  render() {
    const { logs, toast } = this.state;

    return (
      <section className="panel audit-panel" aria-label="Audit log">
        <div className="panel-header">
          <h2>Audit Log</h2>
          {/* Short-circuit (&&): show the button only when there is something to clear */}
          {logs.length > 0 && (
            <button type="button" className="btn btn-ghost btn-sm" onClick={this.handleClear}>
              Clear
            </button>
          )}
        </div>

        {/* Ternary: empty state vs. list */}
        {logs.length === 0 ? (
          <p className="muted">No operations recorded yet.</p>
        ) : (
          <ul className="audit-list">
            {logs.map((log) => (
              <li key={log.id} className={`audit-item audit-${log.type}`}>
                <span className="audit-message">{log.message}</span>
                <time className="audit-time" dateTime={log.time}>
                  {new Date(log.time).toLocaleTimeString()}
                </time>
              </li>
            ))}
          </ul>
        )}

        {/* Visual toast notification, shown while this.state.toast is set */}
        {toast && (
          <div className={`toast toast-${toast.type}`} role="status" aria-live="polite">
            {toast.message}
          </div>
        )}
      </section>
    );
  }
}

export default AuditLogger;
