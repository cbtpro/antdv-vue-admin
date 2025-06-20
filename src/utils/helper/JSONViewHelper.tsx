// type FComponentProps<T> = {
//   label?: string;
//   data?: T;
//   defualtValue?: unknown;
// }

// export default function JSONViewHelper<T>(props: FComponentProps<T> = {}) {
//   const { label = 'data', defualtValue = {}, data = defualtValue } = props;
//   return (
//     <div style={{ margin: "1rem 0" }}>
//       <h3 style={{ fontFamily: "monospace" }} />
//       <pre
//         style={{
//           background: "#f6f8fa",
//           fontSize: ".65rem",
//           padding: ".5rem",
//         }}
//       >
//         <strong>{ label }</strong> = {JSON.stringify(data ?? {}, null, 2)}
//       </pre>
//     </div>
//   );
// }
