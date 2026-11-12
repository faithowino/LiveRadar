import { useEffect, useRef } from 'react';
import { Animated, Text, View } from 'react-native';

import { styles } from '../../styles/app.styles';

type Props = {
  radiusMiles: number;
};

export function RadarPulse({ radiusMiles }: Props) {
  const pulse = useRef(new Animated.Value(0.82)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 1400, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.82, duration: 1400, useNativeDriver: true }),
      ]),
    );

    animation.start();
    return () => animation.stop();
  }, [pulse]);

  return (
    <View pointerEvents="none" style={styles.radarVisual}>
      <Animated.View style={[styles.radarRingOuter, { transform: [{ scale: pulse }] }]} />
      <View style={styles.radarRingMiddle} />
      <View style={styles.radarRingInner} />
      <View style={styles.radarCenter}>
        <View style={styles.radarCenterDot} />
      </View>
      <Text style={styles.radarRadiusLabel}>{radiusMiles} mi radius</Text>
    </View>
  );
}
