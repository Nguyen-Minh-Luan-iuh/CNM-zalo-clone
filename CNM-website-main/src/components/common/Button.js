import React from 'react';
import styled from 'styled-components';
const ButtonStyled = styled.button`
	user-select: none;
	width: 100%;
	padding: 1rem;
	border-radius: 0.25rem;
	border: none;

	cursor: pointer;

	color: white;
	font-size: 0.875rem;
	background-color: #3498db;

	&.danger {
		background-color: #e74c3c;

		&:hover {
			background-color: #c0392b;
		}
	}

	&:hover {
		background-color: #2980b9;
	}
	&:active {
		opacity: 1;
	}
	&.disabled {
		cursor: no-drop;
		opacity: 0.4;
	}
`;

const Button = ({ children, outline, ...props }) => {
	return <ButtonStyled {...props}>{children}</ButtonStyled>;
};

export default Button;
