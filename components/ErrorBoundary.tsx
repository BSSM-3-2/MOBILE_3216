import * as Sentry from '@sentry/react-native';
import { Component, ErrorInfo, ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, info: ErrorInfo) => void;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error?: Error;
}

function DefaultFallback({ error }: { error?: Error }) {
    const errorCode = error?.message?.slice(0, 24) ?? 'UNKNOWN';

    return (
        <View style={styles.container}>
            <Text style={styles.title}>문제가 발생했어요.</Text>
            <Text style={styles.code}>Error Code: {errorCode}</Text>
        </View>
    );
}

export default class ErrorBoundary extends Component<
    ErrorBoundaryProps,
    ErrorBoundaryState
> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: undefined };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        console.error(error.message, {
            componentStack: info.componentStack ?? '',
        });
        Sentry.captureException(error, {
            extra: { componentStack: info.componentStack ?? '' },
        });
        this.props.onError?.(error, info);
    }

    render() {
        if (this.state.hasError) {
            return (
                this.props.fallback ?? (
                    <DefaultFallback error={this.state.error} />
                )
            );
        }

        return this.props.children;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 8,
    },
    code: {
        fontSize: 14,
        color: '#6b7280',
    },
});
