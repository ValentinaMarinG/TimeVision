import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { HomeIcon, CalendarIcon, MessageIcon, UserIcon } from '../atoms/Icon';

type BottomBarProps = {
  activeRoute: string;
};

const BottomBar = ({ activeRoute }: BottomBarProps) => (
    <View style={styles.container}>
        <TouchableOpacity style={styles.button}>
            <Link href="/home" style={styles.iconWrapper}>
                <View style={[styles.iconContainer, activeRoute === '/home' && styles.activeIcon]}>
                    <HomeIcon size={30} color={activeRoute === '/home' ? '#63B4FF' : '#B0B0B0'} />
                </View>
            </Link>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
            <Link href="/calendar" style={styles.iconWrapper}>
                <View style={[styles.iconContainer, activeRoute === '/calendar' && styles.activeIcon]}>
                    <CalendarIcon size={30} color={activeRoute === '/calendar' ? '#63B4FF' : '#B0B0B0'} />
                </View>
            </Link>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
            <Link href="/tickets" style={styles.iconWrapper}>
                <View style={[styles.iconContainer, activeRoute === '/tickets' && styles.activeIcon]}>
                    <MessageIcon size={30} color={activeRoute === '/tickets' ? '#63B4FF' : '#B0B0B0'} />
                </View>
            </Link>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
            <Link href="/profile" style={styles.iconWrapper}>
                <View style={[styles.iconContainer, activeRoute === '/profile' && styles.activeIcon]}>
                    <UserIcon size={30} color={activeRoute === '/profile' ? '#63B4FF' : '#B0B0B0'} />
                </View>
            </Link>
        </TouchableOpacity>
    </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#dddddd',
  },
  button: {
    padding: 10,
  },
  iconWrapper: {
    alignItems: 'center',
  },
  iconContainer: {
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  activeIcon: {
    backgroundColor: 'rgba(99, 180, 255, 0.1)',
    position: 'absolute', 
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default BottomBar;
