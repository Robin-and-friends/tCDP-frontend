import { useState, useMemo, useCallback, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";

import {
  injected as injectedConnector,
  network as networkConnector,
} from "../connectors";
import { getContract, getGasPrice } from "../utils";
import { READ_ONLY } from "../constants";

export function useContract(address, abi, withSignerIfPossible = true) {
  const { account, library } = useWeb3React();

  return useMemo(() => {
    try {
      return getContract(
        address,
        abi,
        library,
        withSignerIfPossible ? account : undefined
      );
    } catch {
      return null;
    }
  }, [address, abi, library, account, withSignerIfPossible]);
}

export function useGasPrice() {
  const [level, setLevel] = useState("fast");
  const getPrice = useCallback(() => getGasPrice(level), [level]);

  return { getPrice, setLevel };
}

export function useEagerConnect() {
  const { activate, active, setError } = useWeb3React();

  const [tried, setTried] = useState(false);

  useEffect(() => {
    injectedConnector.isAuthorized().then((isAuthorized) => {
      if (isAuthorized) {
        activate(injectedConnector, undefined, true).catch((err) => {
          setError(err);
          setTried(true);
        });
      } else {
        setTried(true);
      }
    });
  }, [activate, setError]);

  useEffect(() => {
    if (!tried && active) {
      setTried(true);
    }
  }, [tried, active]);

  return tried;
}

export function useInactiveListener(suppress = false) {
  const { active, error, activate } = useWeb3React();

  useEffect(() => {
    const { ethereum } = window;
    if (ethereum && !active && !error && !suppress) {
      const handleNetworkChanged = (networkId) => {
        activate(injectedConnector);
      };
      const handleAccountsChanged = (accounts) => {
        if (accounts.length > 0) {
          activate(injectedConnector);
        }
      };

      if (ethereum.on) {
        ethereum.on("networkChanged", handleNetworkChanged);
        ethereum.on("accountsChanged", handleAccountsChanged);
      }

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener("networkChanged", handleNetworkChanged);
          ethereum.removeListener("accountsChanged", handleAccountsChanged);
        }
      };
    }

    return () => {};
  }, [active, error, suppress, activate]);
}

export function useReadOnlyConnect() {
  const { chainId, active } = useWeb3React();
  const {
    active: activeReadOnly,
    connector: connectorReadOnly,
    activate: activateReadOnly,
  } = useWeb3React(READ_ONLY);

  const changeChainId = useCallback(
    (id) => {
      if (connectorReadOnly === networkConnector) {
        connectorReadOnly.changeChainId(id);
      }
    },
    [connectorReadOnly]
  );

  useEffect(() => {
    activateReadOnly(networkConnector);
  }, [activateReadOnly]);

  // chainId of read-only web3 is followed by injected connector
  useEffect(() => {
    if (active && activeReadOnly) {
      changeChainId(chainId);
    }
  }, [active, activeReadOnly, chainId, changeChainId]);

  return changeChainId;
}
