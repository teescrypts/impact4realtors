"use client";

import React, { ReactNode } from "react";
import { motion, Variants } from "framer-motion";

type Direction = "up" | "down" | "left" | "right" | "none";

interface ScrollRevealProps {
  children: ReactNode;
  /** Direction the content travels in from. Default "up". */
  direction?: Direction;
  /** Stagger delay in seconds — pass index * 0.08 for grids. */
  delay?: number;
  /** Distance travelled, in px. Default 32. */
  distance?: number;
  /** Animation duration in seconds. Default 0.6. */
  duration?: number;
  /** Only animate once, even if scrolled past again. Default true. */
  once?: boolean;
  /** Fraction of the element that must be visible to trigger. Default 0.2. */
  amount?: number;
  className?: string;
  style?: React.CSSProperties;
}

const getOffset = (direction: Direction, distance: number) => {
  switch (direction) {
    case "up":
      return { x: 0, y: distance };
    case "down":
      return { x: 0, y: -distance };
    case "left":
      return { x: distance, y: 0 };
    case "right":
      return { x: -distance, y: 0 };
    default:
      return { x: 0, y: 0 };
  }
};

/**
 * Wrap any section/element with this to make it fade + slide into place as it
 * enters the viewport while scrolling. Use the `delay` prop to stagger
 * siblings (e.g. cards in a grid) for a more deliberate, premium feel instead
 * of everything appearing at once.
 *
 * <ScrollReveal direction="up" delay={index * 0.08}>
 *   <PropertyCard ... />
 * </ScrollReveal>
 */
const ScrollReveal = ({
  children,
  direction = "up",
  delay = 0,
  distance = 32,
  duration = 0.6,
  once = true,
  amount = 0.2,
  className,
  style,
}: ScrollRevealProps) => {
  const offset = getOffset(direction, distance);

  const variants: Variants = {
    hidden: { opacity: 0, x: offset.x, y: offset.y },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <motion.div
      className={className}
      style={style}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={variants}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
