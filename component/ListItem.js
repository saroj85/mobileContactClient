/* This is an Access Contact List example from https://aboutreact.com/ */
/* https://aboutreact.com/access-contact-list-react-native/ */

import React, { memo } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

const ListItem = props => {
    shouldComponentUpdate = () => {
        return false;
    }
    const { item, onPress } = props;

    return (
        <View>
            <TouchableOpacity onPress={() => onPress(item)}>
                <View style={styles.itemContainer}>
                    <View style={styles.rightSectionContainer}>
                        <View style={styles.mainTitleContainer}>
                            <Text style={styles.titleStyle}>{`${item.givenName} ${item.familyName}`}</Text>
                            {item.phoneNumbers && item.phoneNumbers.length > 0 && item.phoneNumbers.map((contact, index) => {
                                return (
                                    <Text key={"List" + index} style={styles.titleStyle}>{contact.label ? contact.label : null} :- {contact.number}</Text>
                                )
                            })}

                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    itemContainer: {
        flexDirection: 'row',
        minHeight: 44,
        height: 100,
        // paddingTop: 10,
        // paddingBottom: 10
    },
    leftElementContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 2,
        paddingLeft: 13,
    },
    rightSectionContainer: {
        marginLeft: 18,
        flexDirection: 'row',
        flex: 20,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: '#515151',
    },
    mainTitleContainer: {
        justifyContent: 'center',
        flexDirection: 'column',
        flex: 1,
    },
    titleStyle: {
        fontSize: 16,
    },
});

export default memo(ListItem);

ListItem.propTypes = {
    item: PropTypes.object,
    onPress: PropTypes.func,
};