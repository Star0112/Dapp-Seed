import React, { useState, useEffect } from 'react';
import { Modal, DropdownButton, Dropdown, Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { NotificationManager } from 'react-notifications';

import { NavLink } from 'react-router-dom';
import HamburgerMenu from 'react-hamburger-menu';

import copy from 'copy-to-clipboard';

import modalCloseImage from '../../assets/image/close_modal.svg';
import metamaskLogo from '../../assets/image/metamask.svg';
import walletConnectLogo from '../../assets/image/wallet-connect.svg';
import Container from '../Container';
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core';
import { ConnectorNames, connectorsByName, connectorLocalStorageKey } from '../../utils/connectors';
import { setupNetwork } from '../../utils/addRPC';
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from '@web3-react/injected-connector';
import {
  UserRejectedRequestError as UserRejectedRequestErrorWalletConnect,
  WalletConnectConnector,
} from '@web3-react/walletconnect-connector';

const Nav = styled.nav`
  height: ${({ navbarOpen }) => (navbarOpen ? '100vh' : 'auto')};
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid grey;

  @media (min-width: 1024px) {
    height: 6rem;
    margin-top: 0;
  }

  .navbody {
    margin: 0 auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    width: 100%;
    align-self: flex-start;

    @media (min-width: 1024px) {
      align-self: auto;
    }

    .nav-left {
      width: 100%;
      position: relative;
      display: flex;
      justify-content: space-between;
      align-items: center;

      @media (min-width: 1024px) {
        width: auto;
        position: static;
        justify-content: flex-start;
      }

      .navlogo {
        display: flex;
        align-items: center;
        text-decoration: none;

        img {
          width: 40px;
          height: 40px;

          @media (min-width: 1024px) {
            width: 82px;
            height: 82px;
          }
        }

        span {
          margin-left: 5px;
          font-weight: 600;
          font-size: 35px;
          color: #2a2a2a;
          display: none;

          @media (min-width: 1024px) {
            display: block;
          }
        }
      }

      .hamburger {
        @media (min-width: 1024px) {
          display: none;
        }
      }
    }

    .nav-right {
      flex-grow: 1;
      align-items: center;
      place-content: center;
      display: ${({ navbarOpen }) => (navbarOpen ? 'flex' : 'none')};

      @media (min-width: 1024px) {
        display: flex;
      }

      .menu-list {
        display: flex;
        flex-direction: column;
        align-items: center;
        list-style-type: none;
        margin-top: 20px;
        padding-inline-start: 0;

        @media (min-width: 1024px) {
          flex-direction: row;
          margin-left: auto;
        }

        .nav-item {
          display: flex;
          margin-top: 10px;
          margin-left: auto;
          margin-right: auto;
          align-items: flex-end;
          place-content: center;
          text-decoration: none;
          font-size: 18px;
          font-weight: bold;
          color: #2a2a2a;

          &:hover {
            color: #c41848;
          }

          @media (min-width: 1024px) {
            align-items: center;
            margin-right: 25px;
          }

          .button {
            back
            cursor: pointer;
            padding: 5px 15px;
            transition: all 0.3s;

            @media (min-width: 1024px) {
              margin-left: 25px;
            }

            &:hover {
              background: #c41848aa;
            }
          }

          .dropdown-toggle {
            background-color: #f5f5f5;
            border: 1px solid rgba(0, 0, 0, 0.15);
            color: black;
            &:focus {
              box-shadow: none;
            }

            @media (min-width: 1024px) {
              margin-left: 25px;
            }
          }

          .dropdown-item.active,
          .dropdown-item:active {
            background-color: #f5f5f5;
            color: black;
          }
        }
      }
    }
  }
`;

const Header = () => {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const { account, activate, deactivate } = useWeb3React();

  const history = useHistory();

  useEffect(() => {
    if (account) {
      closeModal();
    }
  }, [account]);

  const copyAddress = () => {
    copy(account);
  };

  const disconnectWallet = () => {
    deactivate();
    history.push('/');
  };

  const handleConnect = (type) => {
    const connector = connectorsByName[type];
    try {
      activate(connector, async (error) => {
        if (error instanceof UnsupportedChainIdError) {
          const hasSetup = await setupNetwork();
          if (hasSetup) {
            activate(connector);
          }
        } else {
          window.localStorage.removeItem(connectorLocalStorageKey);
          if (error instanceof NoEthereumProviderError) {
            NotificationManager.warning('Provider Error', 'No provider was found');
          } else if (
            error instanceof UserRejectedRequestErrorInjected ||
            error instanceof UserRejectedRequestErrorWalletConnect
          ) {
            if (connector instanceof WalletConnectConnector) {
              const walletConnector = connector;
              walletConnector.walletConnectProvider = null;
            }
            NotificationManager.warning(
              'Authorization Error',
              'Please authorize to access your account',
            );
          } else {
            NotificationManager.warning(error.name, error.message);
          }
        }
      });
    } catch (error) {
      NotificationManager.warning('Something went wrong while connect wallet');
    }
  };

  const [show, setModalShow] = useState(false);

  const showModal = () => setModalShow(true);
  const closeModal = () => setModalShow(false);

  return (
    <Container>
      <Nav navbarOpen={navbarOpen}>
        <div className="navbody">
          <div className="nav-left">
            <NavLink exact className="navlogo" to="/">
              <span>Sample</span>
            </NavLink>

            <HamburgerMenu
              isOpen={navbarOpen}
              menuClicked={() => setNavbarOpen(!navbarOpen)}
              width={24}
              height={18}
              strokeWidth={2}
              className="hamburger"
              rotate={0}
              color="black"
              borderRadius={4}
              animationDuration={0.5}
            />
          </div>
          <div className="nav-right" id="example-navbar-danger">
            <ul className="menu-list">
              <li className="nav-item">
                {account ? (
                  <DropdownButton
                    menuAlign="right"
                    title={`${account.slice(0, 4)}...${account.slice(-4)}`}
                    id="dropdown-menu-align-right"
                  >
                    <Dropdown.Item eventKey="1" onClick={() => copyAddress()}>
                      Copy Address
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="2" onClick={() => disconnectWallet()}>
                      Disconnect
                    </Dropdown.Item>
                  </DropdownButton>
                ) : (
                  <Button onClick={() => showModal(true)}>Connect Wallet</Button>
                )}
              </li>
            </ul>
          </div>
        </div>
      </Nav>

      <Modal show={show} onHide={closeModal} centered className="connect-modal">
        <Modal.Body>
          <div className="connect-header">
            <div className="title">Connect Wallet</div>
            <img src={modalCloseImage} alt="close" onClick={closeModal} />
          </div>
          <div className="connect-body">
            <div className="connector" onClick={() => handleConnect(ConnectorNames['Injected'])}>
              <img src={metamaskLogo} alt="MetaMask" />
              <div className="connect-desc">Metamask</div>
            </div>
            <div
              className="connector"
              onClick={() => handleConnect(ConnectorNames['WalletConnect'])}
            >
              <img src={walletConnectLogo} alt="Wallet Connect" />
              <div className="connect-desc">Wallet Connect</div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Header;
