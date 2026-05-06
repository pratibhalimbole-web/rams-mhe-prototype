[SPECS BLOCK]

Figma Make Prompt:

Fix the **Trend Indicator Logic** in the Stability Summary Cards.

Problem:
The UI currently shows **arrow direction and value incorrectly together** (e.g. arrow up with +2 even when it represents a negative safety trend).

The indicator must reflect **risk meaning**, not just numeric increase.

--------------------------------------------------

TREND INTERPRETATION RULES

Use **safety context**, not raw numeric math.

--------------------------------------------------

Stable Racks

Increase in Stable racks  
→ Positive

Display

▲ +X vs Last Cycle  
Color: Green

Decrease in Stable racks  
→ Negative

Display

▼ -X vs Last Cycle  
Color: Red

--------------------------------------------------

Conditional Racks

Increase in Conditional racks  
→ Negative (risk rising)

Display

▲ +X vs Last Cycle  
Color: Red

Decrease in Conditional racks  
→ Positive

Display

▼ -X vs Last Cycle  
Color: Green

--------------------------------------------------

Not Stable Racks

Increase in Not Stable racks  
→ Critical negative

Display

▲ +X vs Last Cycle  
Color: Red

Decrease in Not Stable racks  
→ Positive safety improvement

Display

▼ -X vs Last Cycle  
Color: Green

--------------------------------------------------

Total Racks

Increase

▲ +X vs Last Cycle  
Neutral color

Decrease

▼ -X vs Last Cycle  
Neutral color

--------------------------------------------------

ICON RULE

Arrow direction must always represent **data change direction**.

▲ = Increase  
▼ = Decrease

Color represents **impact on safety**.

Green → Positive outcome  
Red → Negative outcome  
Gray → Neutral

--------------------------------------------------

EXAMPLES

Stable Racks

Previous: 11  
Current: 13

Display

▲ +2 vs Last Cycle  
Color: Green

--------------------------------------------------

Not Stable Racks

Previous: 7  
Current: 9

Display

▲ +2 vs Last Cycle  
Color: Red

--------------------------------------------------

Conditional Racks

Previous: 12  
Current: 10

Display

▼ -2 vs Last Cycle  
Color: Green

--------------------------------------------------

GOAL

Ensure the trend indicators correctly communicate **safety improvement vs deterioration**, preventing misleading visual signals.

End.