import React from "react";
import styles from "./chart-skeleton.module.css";

const ChartSkeleton: React.FC = () => {
  return (
    <div className={styles.chartSkeleton}>
      <div className={styles.skeletonHeader}></div>
      {new Array(5).fill(null).map((_, index) => (
        <div key={index} className={styles.skeletonBar}></div>
      ))}
    </div>
  );
};

export default ChartSkeleton;
