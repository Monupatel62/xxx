import { Rect } from "../math/Rect";
import { MathUtils } from "../math/MathUtils";

export interface Circle {
  x: number;
  y: number;
  radius: number;
}

export class CollisionManager {
  public static aabb(rectA: Rect, rectB: Rect): boolean {
    return rectA.intersects(rectB);
  }

  public static circle(circleA: Circle, circleB: Circle): boolean {
    const dx = circleA.x - circleB.x;
    const dy = circleA.y - circleB.y;
    const radiusSum = circleA.radius + circleB.radius;
    return dx * dx + dy * dy <= radiusSum * radiusSum;
  }

  public static circleRect(circle: Circle, rect: Rect): boolean {
    const closestX = MathUtils.clamp(circle.x, rect.left, rect.right);
    const closestY = MathUtils.clamp(circle.y, rect.top, rect.bottom);
    const dx = circle.x - closestX;
    const dy = circle.y - closestY;
    return dx * dx + dy * dy <= circle.radius * circle.radius;
  }

  public static pointInRect(px: number, py: number, rect: Rect): boolean {
    return rect.containsPoint(px, py);
  }
}
