import { ComponentType, createElement, lazy, ReactNode, Suspense, useMemo } from "react";
import { DefaultAsyncFallback } from "./Fallback";

export interface AsyncProps<T = any> {
  factory: () => Promise<{ [key: string]: ComponentType<T> }>;
  fallback?: ReactNode;
  cache?: boolean;
  prop?: string;
}

export function Async<T = any>(props: AsyncProps<ComponentType<T>>) {
  const component = useMemo(() => {
    if (props.cache !== false) {
      return resolveCacheFactory(props.factory, props.prop);
    } else {
      return lazy(() => resolveFactory(props.factory, props.prop));
    }
  }, [props.cache, props.factory, props.prop]);

  return <Suspense fallback={props.fallback ?? <DefaultAsyncFallback />}>{createElement(component)}</Suspense>;
}

async function resolveFactory<T = any>(factory: AsyncProps<T>["factory"], key: string = "default") {
  const requested = await factory();
  if (!Reflect.has(requested, key)) {
    const keys = Object.keys(requested);
    throw new Error(`No property called "${key}" was found in the factory, are you looking for: ${keys} ?`);
  }

  const result = Reflect.get(requested, key) as ComponentType<T>;
  return {
    default: result,
  };
}

const caches = new Map<string, ComponentType<any>>();

function resolveCacheFactory<T = any>(factory: AsyncProps<T>["factory"], key: string = "default") {
  const cacheKey = `${factory.toString()}.${key}`;
  if (!caches.has(cacheKey)) {
    return lazy(async () => {
      const result = await resolveFactory(factory, key);
      caches.set(cacheKey, result.default);
      return result;
    });
  } else {
    return caches.get(cacheKey) as ComponentType<T>;
  }
}
