import classnames from 'classnames';
import { FORM_MESSAGE_TYPES } from '../utils/constants';
import FormMessage from '../Forms/_FormMessage';
import FormValidationOverlay from '../Forms/_FormValidationOverlay';
import keycode from 'keycode';
import List from '../List/List';
import Popover from '../Popover/Popover';
import PropTypes from 'prop-types';
import React, { useRef, useState } from 'react';
import 'fundamental-styles/dist/icon.css';
import 'fundamental-styles/dist/button.css';
import 'fundamental-styles/dist/select.css';


/** A **Select** component lets the user select one of the different options.
It is more flexible than the normal Select. Use with the **List** component. */
const Select = React.forwardRef(({
    className,
    controlClassName,
    compact,
    disabled,
    emptyAriaLabel,
    id,
    includeEmptyOption,
    listClassName,
    listItemClassName,
    listItemTextClassName,
    options,
    onBlur,
    onClick,
    onSelect,
    placeholder,
    popoverProps,
    readOnly,
    selectedKey,
    textContentClassName,
    triggerClassName,
    validationOverlayProps,
    validationState,
    ...props
}, ref) => {

    const internalDivRef = useRef(null);
    const divRef = ref || internalDivRef;

    const popoverRef = useRef(null);
    const ulRef = useRef(null);

    let [selectedOptionKey, setSelectedOptionKey] = useState(selectedKey);

    const handleClick = (e) => {
        if (!disabled && !readOnly) {
            onClick(e);
        }
    };

    const handleBlur = (e) => {
        if (!popoverRef?.current?.state?.isExpanded && onBlur) {
            onBlur(e);
        }
    };

    const handleSelect = (e, option) => {
        const popover = popoverRef && popoverRef.current;
        popover && popover.handleEscapeKey();
        setSelectedOptionKey(option.key);
        onSelect(e, option);
    };

    const handleOptionKeyDown = (e, option) => {
        switch (keycode(e)) {
            case 'esc':
            case 'tab':
                e.stopPropagation();
                const popover = popoverRef && popoverRef.current;
                popover && popover.handleEscapeKey();
                break;
            case 'enter':
            case 'space':
                e.preventDefault();
                handleSelect(e, option);
                break;
            default:
        }
    };

    const selectClasses = classnames(
        'fd-select',
        {
            'fd-select--compact': compact
        },
        className
    );

    const selectControlClasses = classnames(
        'fd-select__control',
        {
            'is-disabled': disabled,
            'is-readonly': readOnly,
            [`is-${validationState?.state}`]: validationState?.state
        },
        controlClassName
    );

    const triggerClassNames = classnames(
        'fd-button',
        'fd-button--transparent',
        'sap-icon--slim-arrow-down',
        'fd-select__button',
        triggerClassName
    );

    const textContentClassNames = classnames('fd-select__text-content', textContentClassName);

    const displayOptions = includeEmptyOption ? [{ text: '', key: 'emptyOption', ariaLabel: emptyAriaLabel }, ...options] : options;

    const selected = displayOptions
        .find(option => typeof selectedOptionKey !== 'undefined' && option.key === selectedOptionKey);

    const selectedIndex = displayOptions
        .findIndex(option => typeof selectedOptionKey !== 'undefined' && option.key === selectedOptionKey);

    const firstFocusIndex = selectedIndex > -1 ? selectedIndex : 0;

    const textContent = selected ? selected.text : placeholder;

    const selectAriaLabel = (includeEmptyOption && !textContent) ? emptyAriaLabel : null;

    const selectControl = (
        <div
            {...props}
            className={selectClasses}
            id={id}
            ref={divRef}>
            <div className={selectControlClasses}>
                <span aria-label={selectAriaLabel} className={textContentClassNames}>{textContent}</span>
                {!readOnly && <span className={triggerClassNames} />}
            </div>
        </div>
    );

    const tabIndex = disabled ? -1 : 0;

    const wrappedSelectControl = (
        <FormValidationOverlay
            {...validationOverlayProps}
            aria-disabled={disabled}
            aria-readonly={readOnly}
            control={selectControl}
            onClick={handleClick}
            role={'combobox'}
            tabIndex={tabIndex}
            validationState={validationState} />
    );

    const listBoxClassName = classnames(
        'fd-list--dropdown',
        {
            'fd-list--has-message': validationState?.state
        },
        listClassName
    );

    return (
        <Popover
            placement='bottom-start'
            widthSizingType='minTarget'
            {...popoverProps}
            body={
                (<>
                    {validationState &&
                    <FormMessage
                        forPopoverList
                        {...validationOverlayProps?.formMessageProps}
                        type={validationState.state}>
                        {validationState.text}
                    </FormMessage>
                    }
                    <List
                        className={listBoxClassName}
                        compact={compact}
                        ref={ulRef}
                        role='listbox'
                        tabIndex='-1'>
                        {displayOptions.map(option => (
                            <List.Item
                                aria-label={option.ariaLabel}
                                aria-selected={selected?.key === option.key}
                                className={listItemClassName}
                                key={option.key}
                                onClick={(e) => handleSelect(e, option)}
                                onKeyDown={(e) => handleOptionKeyDown(e, option)}
                                role='option'
                                selected={selected?.key === option.key}
                                tabIndex={0}>
                                <List.Text className={listItemTextClassName}>{option.text}</List.Text>
                            </List.Item>
                        ))}
                    </List>
                </>)}
            control={wrappedSelectControl}
            disableKeyPressHandler={disabled || readOnly}
            disableTriggerOnClick={disabled || readOnly}
            firstFocusIndex={firstFocusIndex}
            noArrow
            onBlur={handleBlur}
            onClickOutside={handleBlur}
            ref={popoverRef}
            type='listbox'
            useArrowKeyNavigation />
    );
});

Select.displayName = 'Select';

Select.propTypes = {
    /** CSS class(es) to add to the select `<div>` element */
    className: PropTypes.string,
    /** Set to **true** to enable compact mode */
    compact: PropTypes.bool,
    /** CSS class(es) to add to the control wrapping `<div>` element */
    controlClassName: PropTypes.string,
    /** Set to **true** to mark component as disabled and make it non-interactive */
    disabled: PropTypes.bool,
    /** Localized screen reader label for an empty option if included, or if no placeholder is included */
    emptyAriaLabel: PropTypes.string,
    /** Value for the `id` attribute on the element */
    id: PropTypes.string,
    /** Set to **true** to include an empty option. If true, also provide an `emptyAriaLabel` */
    includeEmptyOption: PropTypes.bool,
    /** CSS class(es) to add to the option list element */
    listClassName: PropTypes.string,
    /** CSS class(es) to add to the list item elements */
    listItemClassName: PropTypes.string,
    /** CSS class(es) to add to the list item child `<span>` elements */
    listItemTextClassName: PropTypes.string,
    /** An array of objects with a key and text to render the selectable options */
    options: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired
    })),
    /** Localized placeholder text of the input */
    placeholder: PropTypes.string,
    /** Additional props to be spread to the Popover component */
    popoverProps: PropTypes.object,
    /** Set to **true** to enable readonly mode */
    readOnly: PropTypes.bool,
    /** The key corresponding to the selected option */
    selectedKey: PropTypes.string,
    /** CSS class(es) to add to the text content `<span>` element */
    textContentClassName: PropTypes.string,
    /** CSS class(es) to add to the trigger `<span>` element */
    triggerClassName: PropTypes.string,
    /** Additional props to be spread to the ValidationOverlay */
    validationOverlayProps: PropTypes.shape({
        /** Additional classes to apply to validation popover's outermost `<div>` element  */
        className: PropTypes.string,
        /** Additional props to be spread to the ValdiationOverlay's FormMessage component */
        formMessageProps: PropTypes.object,
        /** Additional classes to apply to validation popover's popper `<div>` element  */
        popperClassName: PropTypes.string,
        /** CSS class(es) to add to the ValidationOverlay's reference `<div>` element */
        referenceClassName: PropTypes.string,
        /** Additional props to be spread to the popover's outermost `<div>` element */
        wrapperProps: PropTypes.object
    }),
    /** An object identifying a validation message.  The object will include properties for `state` and `text`; _e.g._, \`{ state: \'warning\', text: \'This is your last warning\' }\` */
    validationState: PropTypes.shape({
        /** State of validation: 'error', 'warning', 'information', 'success' */
        state: PropTypes.oneOf(FORM_MESSAGE_TYPES),
        /** Text of the validation message */
        text: PropTypes.string
    }),
    /** Callback function for select field onBlur. Will be called only if select field loses focus and the popover is closed. */
    onBlur: PropTypes.func,
    /** Callback function when user clicks on the component*/
    onClick: PropTypes.func,
    /** Callback function when user clicks on an option */
    onSelect: PropTypes.func
};

Select.defaultProps = {
    options: [],
    onBlur: () => {},
    onClick: () => {},
    onSelect: () => {}
};

export default Select;
