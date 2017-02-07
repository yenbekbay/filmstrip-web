/* @flow */

export type WrappableComponent =
  | Class<React$Component<any, any, any>>
  | ((props: any) => ?React$Element<any>);

const getDisplayName = (WrappedComponent: WrappableComponent) =>
  WrappedComponent.displayName || WrappedComponent.name || 'Component';

export {getDisplayName};
