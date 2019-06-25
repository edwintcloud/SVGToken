import styled from 'styled-components';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import { Link } from 'react-router-dom';

export const NavBar = styled.div`
  display: grid;
  ${props => props.cols && `grid-template-columns: ${props.cols};`}
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(61, 17, 132, 0.8);
  height: 60px;
  width: 100vw;
  z-index: 1000;
`;

export const NavLink = styled(Link)`
  ${props => props.align && `justify-self: ${props.align};`}
  ${props => props.size && `font-size: ${props.size};`}
  align-self: center;
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none !important;
  cursor: pointer;
  height: 100%;
  display: grid;
  width: 160px;
  align-items: center;
  ${props => props.padding && `padding: ${props.padding};`}
  ${props => props.cols && `grid-template-columns: ${props.cols};`}
  :hover {
    background-color: hsla(0, 0%, 2%, 0.6);
  }
  @media (max-width: 768px) {
    padding: 0 15px;
  }
`;

export const GoogleButton = styled(GoogleLogin)`
  justify-content: center;
  font-size: 1em !important;
  height: 40px;
  margin-right: 20px;
  width: 100px;
  align-self: center;
  & > div,
  & > span {
    padding: 0 !important;
  }
  & > span {
    line-height: 0;
  }
`;

export const GoogleLogoutButton = styled(GoogleLogout)`
  justify-content: center;
  font-size: 1em !important;
  height: 40px;
  margin-right: 20px;
  width: 100px;
  align-self: center;
  & > div,
  & > span {
    padding: 0 !important;
  }
  & > span {
    line-height: 0;
  }
`;

export const BannerText = styled.div`
  display: grid;
  font-weight: 100;
  text-align: center;
  align-self: center;
  color: rgba(0, 0, 0, 0.9);
  position: relative;
  justify-self: center;
  background-color: #fff;
  ${props => (props.padding && `padding: ${props.padding};`) || `padding: 30px;`}
  ${props => props.margin && `margin: ${props.margin};`}
  font-size: 30px;
  border-radius: 1rem;
  box-shadow: 0 0.125rem 0.5rem rgba(0, 0, 0, 0.3), 0 0.0625rem 0.125rem rgba(0, 0, 0, 0.2);
  :before {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    bottom: 100%;
    ${props =>
      (props.alt === 'left' && `left: 1.5em;`) || (props.alt === 'full' && `border: none!important`) || `right: 1.5em;`}
    border: 0.75rem solid transparent;
    border-top: none;

    border-bottom-color: #fff;
    filter: drop-shadow(0 -0.0625rem 0.0625rem rgba(0, 0, 0, 0.1));
  }
  @media (max-width: 768px) {
    font-size: 20px;
  }
`;
