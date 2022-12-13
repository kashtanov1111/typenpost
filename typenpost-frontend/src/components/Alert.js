import React from 'react';

export function Alert({ message, type }) {
    return (
        <div className={'alert alert-' + type}>
            {message}
        </div>
    )
}