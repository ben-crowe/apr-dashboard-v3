import { ReportSection } from '../types/reportBuilder.types';

// Base64-encoded Valta logo for PDF export (Gotenberg can't access local files)
const VALTA_LOGO_BASE64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAcIAAABfCAYAAAB7l8dsAAAAAXNSR0IArs4c6QAAANhlWElmTU0AKgAAAAgABQEaAAUAAAABAAAASgEbAAUAAAABAAAAUgEoAAMAAAABAAIAAAEyAAIAAAAUAAAAWodpAAQAAAABAAAAbgAAAAAAAABgAAAAAQAAAGAAAAABMjAyNTowODoyNSAxODo0Mzo0MQAABZADAAIAAAAUAAAAsJAEAAIAAAAUAAAAxKABAAMAAAABAAEAAKACAAQAAAABAAABwqADAAQAAAABAAAAXwAAAAAyMDI1OjA4OjI1IDE4OjQxOjE0ADIwMjU6MDg6MjUgMTg6NDE6MTQAhVje9AAAAAlwSFlzAAAOxAAADsQBlSsOGwAAA9dpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDYuMC4wIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIgogICAgICAgICAgICB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyI+CiAgICAgICAgIDx0aWZmOllSZXNvbHV0aW9uPjk2PC90aWZmOllSZXNvbHV0aW9uPgogICAgICAgICA8dGlmZjpSZXNvbHV0aW9uVW5pdD4yPC90aWZmOlJlc29sdXRpb25Vbml0PgogICAgICAgICA8dGlmZjpYUmVzb2x1dGlvbj45NjwvdGlmZjpYUmVzb2x1dGlvbj4KICAgICAgICAgPGV4aWY6UGl4ZWxYRGltZW5zaW9uPjQ1MDwvZXhpZjpQaXhlbFhEaW1lbnNpb24+CiAgICAgICAgIDxleGlmOkNvbG9yU3BhY2U+MTwvZXhpZjpDb2xvclNwYWNlPgogICAgICAgICA8ZXhpZjpQaXhlbFlEaW1lbnNpb24+OTU8L2V4aWY6UGl4ZWxZRGltZW5zaW9uPgogICAgICAgICA8cGhvdG9zaG9wOkRhdGVDcmVhdGVkPjIwMjUtMDgtMjVUMTg6NDE6MTQ8L3Bob3Rvc2hvcDpEYXRlQ3JlYXRlZD4KICAgICAgICAgPHhtcDpNb2RpZnlEYXRlPjIwMjUtMDgtMjVUMTg6NDM6NDE8L3htcDpNb2RpZnlEYXRlPgogICAgICAgICA8eG1wOkNyZWF0ZURhdGU+MjAyNS0wOC0yNVQxODo0MToxNDwveG1wOkNyZWF0ZURhdGU+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgqy266iAABAAElEQVR4Ae1dB2BUxdN/d5fe7i6BhBYQpKg0C1UFlaJIFVBpKiJFVFAEKYrSQbpioQhIsVJVimABFUVQKYpgo/eaXElIIeW+32/3HcZ8KRe4S+G/k8ete9t33u7MzlZNU6AooCigKKAooCigKKAooCigKKAooCigKKAooCigKKAooCigKKAooCigKKAooCigKKAooCigKKAooCigKKAooCigKKAooCigKKAooCigKKAooCigKKAooCigKKAooCigKKAooCigKKAooCigKKAooCigKKAooCigKKAooCigKKAooCigKKAooCigKKAooCigKKAooCigKKAooCigKKAooCigKKAooCjgIwrYHc7bgf4+ir5ERmtzJLQskRlXmVYUUBRQFCjmFDAWx/zt/2f/mczMjCHFMW9FladdO3fcBmF4Y1Glr9JVFFAUUBRQFCgECtjsjip2m3PgiBEvuurWreuaPGVquD0hYWYhJF1sk7DZ7B+uXv1JamzFSq7Bg18oU2wzqjKmKKAooChQQingV8zyHdT/6f61vtiwQfP389MCAwL2ZqRl9C9meSy07Ngcjgd7PvrYe5s3beoWFh6mHTp08E+70xmDDNS3RERsLbSMqIQUBRQFFAUUBXxPgXiHc/T+/QdHV69WzRVbMdZVsVIll8VidXXp0q2z3ZHwsu9zULxSgMB74ZstW9pSM46NreiqCCxVqrTr3nvvHWl3Jj5SvHKrcqMooCigKKAocNUU6PV4r5By5crGlS1bzlWxAgRhbKyrXPlyrvoNGrhOnz5d86oTKEERYIi4LjDq4S5dXNHRMa7YCuVdFcpXgECMdYWFhrpmz57d3+50RJagIqmsKgooCigKFFsKFIvFMjZHYp+KFSv95cp0RZpMJs3FP5dLM+Lv+NFjWs+ej/9SbCnog4xZLebfJk6YsHbTpk1aUGAgUjAAXZqW6dJKl47SIAjnwCLDB0mrKBUFFAUUBf7nKFAsBOGc2W9Wf+21mbEmzAsahRDUvwP4v7+/v/bTzz8FDx02/GO7wzHqWv9C8XbnPV9t2rR08aJ3G4eGhGiZmZmQgxCCBgpDyMIMl3bu7FmtW9fu31zrtFDlUxRQFFAUKAwKSO5aGCnlksYvv+yo1b9//98vXLigZaSngd9DNiNXLhcEgAsP/DcaNafdoX22Zs3cujffXBkaU6tcoivx1hMmTKzwwQcfHE9KuqhlpmcIElAZFEqhIIdBM0IoOhMStDVr15696caan0dFWZ8o8QVXBVAUUBRQFCgiCoC1Fg3YHM4BBoPry04dO+77Y+8ffn7+0Aah+bhccmjUoEEQgvtTBnBYkAIyLCw88c8//wgXVtfYT5zNVg1FSh8yePCvG9Z/HuEXEKCREqQCpSFoJUpMxVD2EQxaUlJSxtPP9G8wYfzEXcJR/SgKKAooCigKFJgCRTY0ajVHvDV+/ISRv/+2Fzwfh8iIoT+d4WN+UGiGGCiltYGCAH9xcXFhjz76aCIWkoyItznaFri0xThAlNW6/8FOnbuuXbM2IhDzgu4hYjEqynyDEKLXAnloMMr+S0hwkGnf3j932m22a4oWxfgzqawpCigKXIMUKDJBiGHOkXPnzHksODgQa0DA3YEQf9B2+Iu5MKEQ0t6tFWZqwUFBHB4N7dXr8fhIq3ndtfI9oB2/smTpe4/88ce+SaEhwSg71sFIBRBFFEuHBF0yQRtaC3qJwhu1bzZv1tq3b9/1WqGFKoeigKKAokBhU0CqFoWdKtKrV79+AhZ9hLlcmAeD0KO+QybPDHFqkBJasH28ZMDWJIZNYQmH5KQUDQtKXrn15roTYFOiAUJwI0r6ff3bbpuQkpxMdQ/lkZ0BQQv2BYhG2sEG9DAaMmEnXKEomrTk1CTtiy+/+rHK9ddnYKN90xJNEJV5RQFFAUWBQqYAuWmhQZzdeVdaSvJvo0aP+nv1qlXRQdDw/gvk+DJLFAdifoziEVb6wCDcMZEGjalWrdrashUrrfBmiLRE2P4bT8l6a968xfZ9+/Y29PfDEDFL7ULpBRlIDyL+xdAxhKEw4Y320rewS01Ns7do2fzGObPnloekrGyJCF8pPKgfRQFFAUUBRYE8KUB5U2gQZYn4bvDg5+9bsXxFdEhwiJ7uZREnGL6whPZHIUgXMUcmJSLlAdCo+Zn8tN2/7tZGDB+2Z++ePZfibI7rRLgS9IPTciowu+8uWvzz7t07G3KeVC4QkvOiLhYcQAEohCDeKQSlluy2p4IsV5EGBvhbwkLDTqdnpHVwZWYeFYHVj6KAooCigKJAvhQoVEG4Y+euvuvXr/84BPNg3B4hlRzuC6fAE2IPT1IAivUgfDEhiya3LR3pH/OFwUHa8uXLYoOCA06bjMa+sCxZ4HINfaBjx7Ijhg271RxuFnl3ia0jFIAQbjDkE95E8fFDC91SUCuTQhKikXYg2PJlH2t3N7krBW9/ARUoCigKKAooCnhAgUI9dHvsmNHvhIWF6QJQMnCeHsPFH4LZYzGIeICBmUOxnQKcXvJ++BEMX3hEyTIytYiwcK1D+w7hjz3y2FYPylpsvNhsiUOOHzv82akTp04F4MCA9PR0FJvSjhINv3ongUqh0ADhhmlB0EbOEwo6SBcITLjpUtNsNmuOBOfEv//5mx2cEj9/SlooUBRQFFAU8DUFfK4R2myO8jhA+tPBQ4bs3voD5BUZN4Ub+D61Gk6HUQ2kCKBCJEUBnikXdAf6E/96bhlWOkFYGk3aP/v3r8dB1NWBxf78TYfDHmQ0pm9q267dg4cOH9KM0Hjd5dbFoLsvIMrIHwpDUWYKRtFZwANowH2Xgg7CkbRzaelpl7T+ffuNX7t2TXlSUIGigKKAooCiQN4UKAyN8IzD7rxv0cKFQeERZmwNSNelnZRmYrsEHqnlZJC5I7+Sr4uddODzFJwUBEB9EYnwQ6EAvxQT3333HY4c67Jgw+frm+Zd3KJ3dWmm4x999PHPEIitw3G1EsvtVnKp2PGFK0L5KBfOYJiUjyQXZwS5YpSP+JELaER3AhYM59L8cEzdufNnta0/bjsAy2B69RQuxNvOuONmxiCkP4uyWp70NHxB/MXZ7GfonxotS4Ti/R0ZabmrIHFcqV90zk7j6DrRv3LTEJ2KWZEWy6tXGqc3wsXFgybU+vU6YDIZv8Gip27eiNuTONCR/CojPaM2v717lTI7rZliJAIxsM7B4LSF6I/pM/mct2e9lIB6iEf0T+FH1k1Zp/BMP7BjhTai94ftQOuirOY+ekCfGfF2xxlXOjOFhJE8R1x4dKF/QMAAq1pU5jO6l6SIfS4IDSZDw9lvvx0UHIpzMzMgBNEAKNRQH/Gsm3xE4xfsn1yfbQqNho2QfmRDoh+dSehaEY8ay0Sr4t67XTt3Nlm5avWqFvc0X2uJNC9GDMUO7M6LU5/p37fy1m1bE8LDw5FzLApiw0ROWTY3w6CNoA/shcZMk37wK03dFQxL2IEOIoCIAOQD/Q4eOJh9SS5iyB1+3P7LkjdmvbEXwkAwqrRLGRoY8fHcQ1ydyzvz5u0NDwvVTFgpm46j9S4mJmt//72/bI0a1U5fXcz5h54yZcresmViQHEAmGIGzm/F1V/N8X0+hk2yJSJUCOn8Y/Kej0OHjr69YOGCvYEBfhj1d2lpKalahCXyiPdSyD+meXPnHQgI8ENVdGkgCc75xdlGyAu36IgOmJBjqIMkHIUlTPplc2X9E37Rfk1GshW4s5rSkX7pLsJx6w/8YCTkYnLydXD1OXz91Vd7Dx44oAUFo19IIYhpFbvNrrVu39bu88RVAiWCAj4XhNjX9mPnBx8KQUs4iiZTmifGkG8Ljp6VRGgcQu6h4UihwB6k1BakAxsd2D4bkwC6sf2hkcH0xxFtzzzzVKe777l7qM3pHG2NiBgr/RWf3zWfrn7z1KmTCek4Q5TaXybKJ7mxuxQgDGkjfmindwbYkSVn0v2LjgSJCHq4acAHoUPDngeV4wqrCja7s4rVEnHIEwpUr1Ftc59eyxbbbDac+YoFSej2R0RENLc5EiYjfFmrOdwrQtGWkPDs+DFj7p40aWLzkCB0jrCPNO1SmtasRfMzTz7ZdzDSGupJfq/EDzTB5t27dwl+++03WwQHgSmy8wHGyDrpZ/LX1qyr+lC9226ZeiVxX00Yaqh//f3X8ckTJ9b3hyBkfb6UmqrVrlk3PTezpFrNYbyCxOcwefLEBn4m063sYMquGOsc65VeP5kxAA3ZbcUTGqSsivB1uXFKH9JB1lAKIKGRMS74M0FlTEMHyJdgd9hfdTqcpxo0aNCcvCQDc/EiT0g0A8IwMTkZFtrXvsyDirtkUID6l89hwTvzz3yxccMeh9OJeihbExuDPCGF7B525Oui/eCdbQd2GWw88G80woQbRV4GGKd0FU4ijAgGy6CAQDawA8VRCILZdY63XTj62+/70ApZZgB7p8i8RJaOlMAfe+EspxB0sIPnTAgm4QaTf3hB2aEP41F0LjDs48LqWmdiojb/3YW/jB03bjtSOMxkPIFSVsuSe+9ruTcNc4yBgf5aADoWiYlObdWKlY7MjIyHPYkjPz/YMnI/FP3Zv/z0c0er2YJ0/LQQ9NJDoRnOfvut+QajiYzJZ2C1mjfhUNu10aVLIe0ALdA/AKuPg8VVVy7sTR38/KCBh44cDbM5HTf5LBM5RMwOoAnC2Ijvx8VTgThnFvnUgkIDKTZyCOEbq0C0H3aimH4A6YOj/gL9A5En0grPfIcfYgD80AwKDMIz/fkhrAwTADsZlvVI94s9wyIs/AQx/iCcpcvxUx+C05k4+vnBzw9wYSSK17sxz6zXQajfZizaW79+7X379+9vhg7j4z7Mhoq6BFCgUAShwc8UFXtd5e6NGzdemAhGTS6Odi8bObiAGAKFFGRPlMyfhkFO4YihFU7nCIDBuQWyBjFviAf29ORh3RSgmdrGDV8Yunbp+qUMUHx+h7844rrx4ycawnCkHBmfKBEfSAsKe5RD/Iky6doiBCM/kNBaQB8ZRliIcAgkhSgEJwb4cAh3sla+XLmPWrVs2QCaeCy0QY+5aLzDsWLQ84MX8KYP0pQQ4GfShg4dHPLH3j2/2m2O54XlVfxAkx0Yd+Fc8h9//oEyyeG3SxC8LVu0PBUYHLoYgv6tq4g+z6DxNvu6F18aOe/bLd9pKSkpMn3UF2rn1Hn8weT/2Le3wi/bt7UwuEwX84zM247sCYHk7CPKtsAEZCfJYg4vFG3QnpAQEBgcFHrxYpKWePGilqTjRdyCkpAo7RLQdhOTEjXaJSYmaKmp2KmjcxDmnbUwJTkFw9zwh3gSgPQrkM+Ik+3/4kW4JyRql3yoEdoTnfefPX2qybYffqweRO1f9LJBVdCaj5fSUrU43HgzcOCAl9CRXGp3JMo9TN7+tiq+EkGBQhGEmPDH/gCtz/IVqw7Wr9dQDL1R66MmQ82IfJeVk8wRBizwnCVntCeXYGMTQD4tmDUrtazYbJFk4Jx3+m7Llpbz5r3zuPRctL8Ynml64tSJLlu/3zI9KCBI3CeYNUcUfkIyCksWUOoAl8tKG10wcZ+h8M8wAt0GwqGBlytXQVu89P1lF2z2CXApEESazQ9ZLJbM5wYMTOEorNi6iR479mhqNqf9axfPdbsKsNnsAV9s2NgOeyehGfAEHdkBSHQmavfed98ClGgZDmI/eRVJ5Bo0zua8FV2NPnv27O5nxRYTA+aw0qAl1LjhhvSLYOxC6KBCyrNs132CvD0PLSEo1wi97cBxcn5S/HBhimgE6CRxIKSwwBIefuno4cM3YBGXId5mM8THxxvigDRt9jjYwRT20s1mtxumTJ3KvhjySxGoabxKrQt6oTJ8HPwjvB6GcYn47DYDFkoZcIC+wQY7n5Uvw9Bp4xcbv2YGM/BtTTBT0FGsUqWKdulSuuaHum22RGgHDhxsnpScGGQxhzl8lhcVcbGnQBZx49u8oqFNwj2Crza6vVEFk1+AS1/AJRsSGz+YPe2EgKNWSIRwo9IkZZ4cGuTNC4JXCCZBwUD2IduTFIqo9ODiQ18YsujwwcM9fFuq/GN/5ulnfrjnnuYfYEWm9IzRIBMLhELgxikwZflM7scVjJz1o1YmioTCs/wChBv9YKjUbccH0IELDxIvJmuRVmvNalWrrsMw58t6qAIapnBLqaj7ExxOmSQYHFe2jnhhOHrSGYsLGFl27xHz579z74ED+7GwlYIQGqcpQLuv1X1a9+7dRlvMEfWzB/DWu8mQOerXXTs//Wn7T0LIkLzUnh98uMuSMWPGiaFopkWd+5NPVmnvzJtzEJRe463084uHIx6cJkArkJ0eVnAA6zM0tWJ5OEJ8vPOFBGh1XEgj6i1oyiF9u92poRPxmihAEf1AeL+15bvNn09+dbJoa2wupO/tTe/U+vTtu4CdH+5TTk/L0C4mOLU5b8++UERZVckWEwpQ9BQqDB4ydMKc2XN2JiZcFA2fvUkXhz7R+DlCJNgRhQT/yBDI7IXggBNMF9UVgvCD6gxnMgwOL9KbcIIAxd2FWq/evYdIm6L7LRUdvc0eF2fy535BUR6d5FR5URYyDxZCbI3hIyUgerDCFGVDUZF9QQ/6FR0AmCyv+NMw9JSsDRo06OTyFcu5oKXKFZfW4Pqse/ceLbt0fciZxoUFTA5DhydPndQGPjNwrC3e0eJK47ZaLRdiYmI+LxsTgzJzbhPXatbitdZt2g63OxPGXWm8+YWLt9u7/7F33wtYiFM3GHNXmZhX5dxUo4YNtE6dOi87dvRYjBFH9vnh+5DQyKd28NDhN1CnhkFzCcgvfm+4i8Up/KSifjAbyAj+jZjXQgfyBm+k4fU4DJmR7oMwmG3REJFpox/p6GI9LDIwGPw+wvahl81WM6ow6hq+bQoWH/Xq9cRTbdu2W9+oYUPMFQYhmy7MhQZqM1+fGTxr1qwW8faEvkWWaZVwkVIAtbZwwRIR1qttuzb123fosCsJty0YhfbDOTLmw83a9XbFhiVs2bbQ2ig02c4oBASvgH82QrwwOJkceCwAq9JQ+Xfv2nkLhm9+xob+d3GHYQW6FBYgvTcXYj380sWLGwQFYV4QGRP5RhmwYE2URUywiHJTqAGF0Jc55Lt7daigCtzkfKikEn1RXDKqSGvk3jFjRleIiY5OwLzgfhlDwX8xhL3P6GdKmTJ92lQ/LGogI+YMmjXSqh0/cfQ5ZOCgzeasVdCYIegGbv5m8+z169ZpaWnpyDUOTsfQ5HWVKye1aNHsQ8yBflPQOD33bzyNAxdessXHBYn5TySO+xs1HHT+PoZoz70yetSzdza58zg1RNKc59iuWrlCW79u7S2om4WyvJ70EPWfdRp1me+sFuz82BMSh3te1sLzyb2u/GNeCWJgA6ZYuKUZbhOWRfAT57CPPXXqeMX3l753awBWAmN4BXUuTateo8aFRg3qLTf5mW7u1qPHAgz3SlqjHObwCM5ffhVpCZ9fBFlWSRYDChS6IHSXecmSJbdFR0eDkUvtgHLucrPSF8oYqBlR+KGykuHzKDGx7QDv9C0BAcU//HFHPoWkeM/UeOTY1ClT6r84/MXnMCx7Qg9QKMaOnTtenD5zRu8INLJMaH5yCBRjoQAKcZFPDnPqrIR2UgOGG/Ive9gspfRDIcpic8uFKD5+qEkkYNECVol+Ync4diLUVQP6EqsMBv+ZNWrUOMqFLKwg3Hf1574/sUn/h00YCXusIInE2WzWjIz0hSNHvlwtCL1vlo2dH2qcb775xgfhEda+mLf7piBxFsQv5rwuzJkzpxeP9uM9j9RiQrCHs1PHzq9HWi2/GQ2mUtNmTF/MlY9cuckMcuXmhHHjn9+8eXO4zeHwyorZPPMsOkaiAqBa8OPLKoDeEzTCsCl5hi0qR7Yz1klml1lHfZT1EhZ6GQo7a/HxjjKGDMO4oS8MfS4Ni2H4vU2osNwqsWD+/KUhIeEvY354/z13NZtZrkIs+mQc9cjEojB/bca0adqChQtvi7fb2hV2vlV6RU+BIhOELPq06dP6XsI4PYWdLg9gKxm+sEDuyJu4mVf0PtnS+C8kCWPQxYgoBZafS7USDRKNFH9cbRkIbWzjhvWOVas/acgQvgZoP09euHCu9rSpU+PjL8RB+8Ntiu58IT+iAMwEyiLmQVEelkm64JfvKI9eVMFghPBjiUAmll2YECZcudewQaNBdercvNdiNnulF479gljSmfnNsOEjPk7G6ko5cauJpe9DhgypfObM6aUo44ssgicADSHq9MmTscePHWvBrRL8ntTWa9Wqo9WuXQfxZH7hSTwF9WN3OP2BQePGjHkaFx6LkQJWG2qi6ITtjS4T09OP86WQ4NCVD3fpcjYFmoMBw8/cPgABWtthi7sZ1N5W0LQL7J/flN+dgLoi5olRAShccNrLLulQvH4psJlnoxB6qJjspDKL0rJIMovDO5unutLr/Pnnnw2DQ+TtNpxTb3z77RfKlq3wJnI8CyNSH5gjrcM+W/3ZzkwIQo4SYIxGmNNnTB8MLvKF3e4ovIVSRUIplWh2Coi6m92ysN7btmm7oP5t9ccnpVwSQ55oTro85BNamc4MKNbI/bmlQliLeTX4ka8ikNAc8f6fcPDij/mg5JRUw/dbvt0OBn4HKnlP+vIVYHhxXrduj/TESTf+AdivRLYGLiHLgvxTwIntHjC5yIDMTi80nv/9HGQ07v4BmY14R0xuDZHaWr2GDZIXL11iAhPy6s5kaM+Nbq1X7/dWrVsLoUDamvyN2tkzZ7QHHuikoYyvekq/SIv5wPRp0zddwlL79AzZ6cGKQ61+vQaLrBZLHPBHT+MqiD/kuQzwhiOHjvSPLl0atORwub8WWyFWO3XiRF1sm9jE+LBIJz4jI+2dvn37vkHtmitzucSeQ6Sz3nhrB9x9Pt+FWoA/doVQFVBnpXbFd7xorpq0L37AuouFMvgTdRzZFblFRi0RliJZpAZZ3BN17UdecC1OsULO4rFIrX6DBoshpjdaLBFHBR0zXYstkdZWt9xaT4y3MOMREeFa/AVbd4vFfAmIHqCC/yUK/Mt5i6jU69avHdXxgQ5J4tQHtiShFEnhIBoZHoUGBCcxdAgmRZPNjwxDZx8y93inX0YiDPrDQyD2wy1c8K42dMiQ/qjkS6Rn7/7iPEO/eGfCrhXLl8/BEOIQzgvKzDGnnB9EQQA8w5H5lvvFRClgK8srDORXLKDBi/hjGXVnwWrgzsUe4RhyXbF8dVhoaNj91vAILPn3LphMfrWxurXriROUA8gzhFhEeKhWsUL537EAJcaT1LBlYvSkyVNuXfv52vLcuM6P4e8XqN1wQw1t2IjhO6Ht3OhJPFfiBxTf+t6SJSN/37cHe8ag6aEuOJx27d5Wrda17dBxd6ko62fueKMioxqVKVc+4dXJk1FS1qhMbGg3an/+9YfWrVv3h+PifTu/LFZCi2FZ5gh1Aq2S356LPNDpQEUqfoBqCSpBk8IfOxkwhNbNFdE4OCG2sHOMNN98Z8H8MbPefD2Qp0wRTPiG97VqpQ145ukZVkvY5UVHUVHW7wwmv43tO3Z4HyfPoIOG/aQ43YjDpC3vbXkY87LVCjv/Kr2ipUCRC0IW32yOqMVTH3j6A4b0dWYkGxd+ARR8BLQ2/lKogLGxJy0n6dEchZUuAOFCxsdAbKycF8IeOe2LjRsfOXb8hK+WxQeCE9w+fsKE/laLFbkUEl0IYi444TCtCXky4kWUBs+yTCyQ/gRDlAM/NEUBOOSE/Mt3WKHA2NOlDRkyeA1U5LWw6Uyf3gYMIY2Y9eZb9Rs1ukMIZlKbivj3W7/XFi969wkcvZavJoc87/M3mXYGmkAaMBuW4fyF81qr+1q/hm9dEWn86e18Mz4s7W/53Tdf3TJr1uvNg3BCitQGTRDANbUXhg7bhLpxc/Z0kTXrnt2762D0AN+FzF3TymGFK1YbLsMCC8lZswfy0jvrJ9Mj8LO7n4WAEbbF70cM6yOjrNvMtMgzM0/UMifztzABJwOtO3r0yCTshxUtiwdvxEEbbNe27TiXy69Z9rxgYUzj/k8++WjTpk3lqAe+eiBOu/l19+7rhg4eFIRtK4V6ulD2/Kn3wqVAsRCEr4weXXnOnHkreHIFpYPcTydalC4j9BZGgQFuKuUGTNECwbR0QcJeqgTJyIQ7/VBaoqXycOdWre5tNnDgc+XcPr1l7tv7e/CjPXqcOHPmrMyXkOjML1OgIGM+RVcfpkzVLayFBexoTYZC+3+ZIG1leVj2VGg3NWvW/qx///4dcHpMG2wElpv+ZJRe/cUVVzvmzJ09jRoVN9ZDJmulIqO0337dMwkLER7C9gI5EZNDqnE2xxMYHj47c/p0zQ/Dqiwch35Dcfh68xYtF2Smu37OIZh3rIwu44Xz8cOcCU4rr+ki3Tgc+0CHDhuwUGcDVzZmB5zgMm76a691aNmypSP1Eobq4YFDpJu//lrb+Pn68VgFPCR7GG+9I3viuzM+8f2ZOMCQZahc2hSfX1GHkXHmncTSa6l4wHx1oQ6NYlX4M7t27XatXLbsbp4ZywxRy6te44aUdu07plssYR/mRjmcOdvl7NlzYgEXy8ALv2NiyuzBtpU/cguj7K89Cvx/jlAEZbREmDe3bn3/w+3btv2VZ11ifptcgD9SyJEDEy5LED7jH1qWsBLP9EDR5xYiMgxtGB+FJYea4uPiQ0uXjjqJ1YDD0IDKMNTVAjYRD3E6E87/8OPWqGCsjOQcoFz9h+EtZAMihJnFP/NETY+/4hFZlmVkIxQOIv+0wzuQ5aEmxrA8Qg5WrrfeeP11zHd6PE/HqK8EMCz3cVJy0iuVq1Q5z8uDOWzIlarr163RPvrw/coQKk1yihd5C8KCmNVvvz37qdRLPM5MFBPL2FO0KdOnr61Vs2aHyKiIVTmFvVo7m8PZaPfOXX/PmDFtGI/W4spBMmuLJVLr0aPHLGimD6Ncgvz/Py1j9JtvvrUCiy7EGiFqPaFhIdr777/3CK6LesNhc0b9/zBesBF1A/EIQsFkdWG0oiHwofgB66UQgpyqYH5ZXwkoA1YwfyBfCucXHcK3X5086dkMDN/zEHe2ebaVJe8t/QTnt+baWWPu5s1/p+xNNWuJlaVsY5yWmPXG69qGjRtfQj2eVjglUKkUNQWKhSAkEez2hDqvv/F2s8Z33Kmlg3mxdUlh8m8rEw0vKwujBZkHAc9sjBzWovZl1HjihRQ+NEXvGh78MH8wDVpKnyd6RyOUR3NdIv5cfjDPtfS1Wa/boQ1qFmziF8KZ4orI/EAbRS4wz+cmNcqFRzZWwfFkjmGBcnA0VRSS+cdqNuTXXR7eM5iCYbuejzzesF6Dht+CmXu8cjOXrHtkfV2V6+OfeebpL7ghmRotmQX3GE6ZPPWNlR999HWOkbi02lis0PCf/f90M+MOSobB3W9aZKnS3JzfCVLGZyshcUzb9vc/eP+x06dOCQrjIG+ciZmqffD+B8cqlK/wRaTVPD7HPMMSNH22VKmovg90eMCZmpomvhtHRbdv345j5mznUSt9s8Ee35xbg1gHRHVm3Ud+WJ/BjCvnlt8itUd2WT9FRtlxZfWFyVNyhH0hZm7fvr2xB/b/0yYUc9hsL/y/5dZbE8vElO+P/KzOKytYrDXr0zWfHOH+Vj/RMHHrCubfcXXTRJTjA9z+4ZvOT16ZUm6FTgE3dy70hLMnaLGE70MPeEDr+9t0DgkNFSdUiEotq7ZkDGx8/KOKpIP0Q81LfxKChO5snQC+o8G6Zw/JlK1WKw5Y3jdk394/rmpLBY6SsmJu4q8t33y7ICQ4RL8ZgyKOAkzyCCitEMmw0fNM3uHKkGTnwm051wLPmZSOQFE0UUpRZr4zz04cZ9WzZ88/Xxz58m50GmqwaIUBmGup1K79AwsbN74dcyn+XE+AMzkDtKTEi7fMnjuXk6E5wb7pM6ZNPH3qNIaj5Qb6+Di71rxZ8y9fGj4iHZv+fbJlwp0RMMaxpUpFi1OISLsyZaD4Gw2N3O75mU8/88ySxER57jZvpeCNBXfecQeD6efk5RdDwdw5BCu32KCeoH6IuivqrYjnXMFiKyTfzCfrNP5lnqlFsw1ixEPW3ELJCDqi28ePm/A9D0TgxnlKY7QPrdMDHT/ByMyfUdaIX/LKCC5D7pSReummunXr4AxSjEbBM/cVYosNjmBLfg1d2B15hVdu1wYFio0gJDkxtzD+oYcf/h6CqjUO6BUNjNN7bokgF8nAwp1rmJgBgj8KDnqjyeFS+IFQoZLF4GJYFPb0R6FE5oaNs9qT/frM+/uvv2rDyxXBunVrErp369pj3x97kZAUxJQU1ArllgfmD0cGYIhLdDbJJMCYZX6QOeSf9gzLclIDFlkXcclnHhbMclcoX/7sa6/NvAkdBsx5hP99RRm+gkDQki5AeHeuVbvWa2fEXArvdcvQgsOCtZtq1jwPRjQya7QX4uM74lQWy6oVq28LwXwLPwCv8bFGRWnDR770LPb2Ncjq35vPGJL7Yeq06RsO/PMPBDDm+ZA2bzp4ftDzO2rUuGE+08KKwBk2Z8I28exMfMmW4NyOFYfb7YkJj9sSndcDy5aJLvND7z59wNgRAeZGudk+0Zlgbte6VQOH3VnRm3mWcbEjhydkGJ9e0IydPd7EBfoX7k0YnhaOFVVosaICi7rL/LPDabaE9/A0mqvxF++wj5w3b3Y/nFpUKRiLojiKwiugmt59l9bhwU4f4ai147hV4ma7M0nkB8/LmR6+//Z4CFB0ZLdjeH9YiNm88ZkBA79OTMXpQigXt15w4d5dd90VhFefLEa7mnKrsN6ngE9Xw11hdgO//Orrbi+PfCVt9crluOLMD0JC3lIhhAtqJuSFFHDQTri1gG/8o7ZCB1pR+IieKYUL/MubG2Qnln7Z6zt/Pk6b9fbsFWggb2DRyWzGVBDAiTF7tmzZciMZZuJFCjOREDJAXU9Pl084Wcbop+cP78ymuN2BOSW3RjjhXyQOfzDdUfGF++9eHDHiue6PPDbZao0YUZA8esOvMcP1+ZP9+x9bvfqT55MhWNywevVqrVXr+09jIckn2HvYkfZgIKFp6SnT7fZ43FHHkUQDti04tBYtWr6P2x2ScMDAfnd4b5pgap2/2bzpnk9Wr7zEU2TYGeENA02aNNXatW/3W1JSgnb48JEFcefPkeT7Dhw+tCDuwlnWJfRiRMW5E893Mk/k8Q927rxh0YIF92O/GZSMDDGKEBoW/h06MXW8mW+RHn7kgAFqARNnBQeww1RsAfTlaIaYCmB+WecpE/G9Mff+AebtfC4MMf2xLygo6Dc/NCZBP7RDHLit9evXV3PE2zrjyMW9OEN2ANbNaIcOHrjnwrkzzr/3719w/tzpvWxXnEfkzRQ887BmnZrabbfeph36Zz/obsSdhQHcg9ioR7cehXoiVbH93td4xoqdIMTqvRNgauNwg3mvXTt+Tj9x8rhgCGAPUkCwqblfKEgIaIhkGai/eJQiRQ7PoKEKZqILSjI8EYTCBvNWGPJaumhRjYjQ0ChoBWPB8Gbi2C2HiNODnx+2bl15xx1NoDTghnMge8OM34WGpcs39JqZINJH0oJRpENAii0isIOTGBplGL5A03JhQQ9DUFvk+aRcrVm77s3aMwMHLCN6kC2ve7FEWjbgYuGOk1+dsqj/U317gfkIzRabzbXDhw4tREGqMlHsG+wQd/7Cb5MmTnmPx5TxW7CHzTL2fKznXINmuj/SGvGO1zOICEGzFLPFcunggYMaFyzRhlct/bRtu1ajeo3eJCgXUgieTQKLXhM5N2sOQdYJvpLmPBEolMey4Vty2JLv23/apk2fPr2nDftXcP7qJBnu6n8v33B1uWKLGiAihgY7HcesvXD1qfgiBrYrN/1kx0/IQreVL5LU44y3Obp+9eXGQ2NGj8ZZoWFisQuzgo21Wu9evXCEX0ZvMYIE//zm/BGHm4tvz3qJdoZnkVX8sHuKFaToyKEEaHfwgT2vJuybrXAWoxjdUNc/9mFxVNRFTIFiJwhJD8whHQBT3T16zKgZj/fqNYS3YLPnKRsdflFxWYnlaSt8ELUblZfVmoOfsiLzaDY3UHOUzZaB5TMjKhUVqS1ftmwcBOD1w4YP91gIMt6p06bNRZriEmDGjb9W6IVuZD65ds0PiCOeBkChe0vIQ81YARuO/8kwZuwBT27E7IpywJ8YPgWzZgnYYJlDIUg0V39w4rmTJk4YxTSLCgwmY0XssxoZFhryUOql9DBqtLyFfPZbb/GotFAwi2ZgFp+NfPnl107htgrQE2UBHVD4KVOnaI0aN6oHITjLV/lfvnLFLyOGD9VCIaR5fi1vNOGwspE3rXONCwgr6wcoy2eSmCBe5CNpLqzwI78DQ8hQrHO45kr75ZefhxhM/rEYRYjFKMJxd8irMXmEnptpsxYJgEEBXFyFIAWFyKre9kTtR8Z52AM6n9CyfQe4ZJkf9PPXAf7sgFLlwwcS22Igx3iYBQblAcgjvpvIIp4vf39mXfRU4YygenMT7U0E0d3gTVuyeJHW5K47Q21xjnHWKHORtkFRJPXjEwoUS0HIkuI6nFtoYpHGqT2//zojyhoF9sYKzJrNB9Zx9OrwSq2P1Vw68JmOFEJ4pjttUOPpQwokPLHt4I+LOdIzU7XP1qzZ99vve6rUrV3nNLx5BDiX8xQ8Zr+NIfs74xJ29oSUsubwII/jz5KJnOLM4uz7R8xVzcIKup/Hjh1/ZPDgwbW4+diVmS4Ozx4zetTke+7e0g7H17V49JHug2JiorVLWOFqxEpXqsInTp3EHZT+8b7KJS6MDbrr7nvaikVUYlgA3xlD0bwFXXxl1hmAW9jIV9YKYclfyQT5QK6o+6dB7TAUlz2zG8bDm3f8slM7dGD/pltvu6UGvXsFhFRGbRQZYoyyrrLzV1yBWRWiBTSiAGJOSSPRRjWtwNMMBSkn0jXv/W1PxtEjR3sFU2vnTffIUAqO8csQt5swU5CI+ID8Iz9gDRAaIWnLFxCbXvCAd5YG/mDBUSIujuLwDb2VxvF8e/bsWdCje4/LX4ehFFxbFBBVobgWyeZ0dly3br25c+eHNG5ydvfcRLVGbZbbK9j8AKy4qNAUfqJegwHLXh9d9eYp/OFdf5XDI3K+cP/+/UH9+z71Er34CixXJgR9lZ0Cx2s1hzVo377dXbGVYnEEGQWhC/c+huHw78T7cXRdxtYfv+/144/btDR8K/ZAEi9e1Jrc2XTPoEFDNxY4sQIGSE+7tJB3CeocT9xCPuj555vjnK0Yo59/DARxjNHoH4MN1zFGfz+8w95f2uOi4Bi/gMCYgICgGIw+AEPEM+6si/lg+fI1XEHKo8MYOZkkFtJcf+LUqaoFzGKu3jka5+68MY1M9NZEaqIi5xqsSB1E22P+2N7EaA1bJVb3ULpk+lYQouCuKTNnbkhJSRL3ZZJ6Sckp2owZM7/FyEVMQFCQ/N78xn4B4vtj+xG+v1GvC4ExWHwAPwEx/PYm1AM/fGs/mE8//XS9UGyfoLDkcCn2IWrz572jHTx4aEmRElwl7lMKFFuNkKW2RogzND/BtoFJuEDzHObMcKcRmATan5tHkGWIPp9U/aCA6I2T7/AoDMQl+4V4YMOVbEdUdsFxYM1hvl/37B7w8iujkieMHzcMVgqyUQDDn8GgamqNGjd++Pn6dd3DsW8yEz1w3tqwcuWKzAXzFsRzbhAExvxKgBYRFqhNmDC+j8UckucS9mzJFOgVG+ib9H6id2/ccCHm9NizS0lO1V56+eXjjz/eu8uoUaM25xahPSHpftSHPpaw0P+3MhArDW9DuN9xCMBrjz/xRPtVK1eKaLgC9vjRI6ZjR4++B4vGucVdEHsyXfbNSDghW1iHYZF1m1BB4isMvxyNYfuSQ4tsg7TBtARGCTBpvs9XecCq3T5jx49Zu+e33Q04H0gt3d/fpDVo0IiXPA8F2k0BAY0xpPzdleTh2UHPv1azTp3fn+zdr3ZwMI4GxBxGALYNvTB0SOsriU+FKRkUIN8o9oA9PanLlq/YloChLnkDNrIM5kGQHXXJRsA+YAEn9qjBUcQ7uAwFn1itAiEo9EeEFbZsywhCRkQzOrq09t7SpUPtdvuHWDyzh9Ep+JcCmANMBl4cMmjw25E4T1Vs7UCPmd9g/Ljxhr/3/xPFjfOk7cWki1q1GtVx4r/lCE7zCfs3Fu8+YQP992dOn+oZEREmtjtwOLZ0mWgNwqsOVvSMyys1S3jIhpyEIMNYIkJ2Ai/hNKLrcHvFo2fPnoUtdB4w+hAcEzd8+PBGWNQlVpnmlYZnbnpdpWfWRdCTpyBFYBFIcYVM0cOE8ENbY/shI6GWmM5VmJmZPrsxA9ttD0PzP8MhUJEW0j+PlaJNmtyxChreOWDGlQpB0hrz8gOb3dOsVd1b6mIwAYId8QcHhWBI/JdSWJGKE50u9iuu30Tl68opUCIEIYt3e6OGrVrdf/+qhAQnGAXFlmQYl0WgEHjkI5RydEfR3I+XH+TGeykh4QdhpD7JUGBy6Zkarwtq3qzFnVgd2AA3StQTCamf/1CgSo2qZtzyvSaV8zGkIYbD4uPiNCe2SWCxkNiDlYS7DJ8b+OxPGKp6MjIqkpN1Xgcck/fDqlWr4g5gyTv5L7UobtVo07rNH8jX/ZjXPHm1iUZZLIv7P/X0iYcfflgst2d8XHa/e9dObegLgxtBSx56tWmw7rFKU7YQeAh3ABb5/PzzT/dFl452RZcq7SoNLBMd7Yrhe1S0eKdbmegY2MVc9oP5WVeZmDKuGNrDf5kyZQ/KWL38y7bFvY74IwgTTU6WwTdsBStF7/1x6w+VsXpZCGAmzTygjFqvJ3rPRh46YQETxmevHLAgKh6XNTfGjSSTeD4tt1eIQyGQTr8n+w/EyvJAHMjtpQ7QledThfQuBXxTY72bRxEbGM7Mue/M+/HGG2/ECS4Yu2dPFH8UikIu0qRPmqJt8gco3nUuQ2HJR/EnTdRv+pJeycShURw9djT2hptqJIOZtqKTgv9SwOQyVLrpxpsm85JbQV9+B4Hc+oEFExiu6tWzl3ZH0ybHcYTVhP+G9s4b6sPkA3/vHz5w4IDIwCBs1UC07L2HhUZoWP2Lg7VNXbyTEg96iPj20KHDljR0lLjRmmUsVTpaO3f23DTUqK8gkK9OdZMVWB/uF7VY3KzOG1l4CHRwSLAWAgzCVVZBGK4LCXHbBYkVkrx8OshtFwg/GOanHaYT5HyttwiRJR5+b4yEghI6CxFz9PwIcDFclSzKksp/HzHHF/TKyy9X4cHtrHGcv0vLSMPt8wt2BwYF3YzFa6//N8SVveHewlUrVq4YeV3lKriX0h/pUEM3aevWrjFOmTLpEIZj77iymFWo4kqBEiMIwYwGQ/1Y2Ldfv7rctyelHRodhBe1EkoyOT0on/nLZnrZoAWFIkduOKkPiSjDka2JVykM8RyC7Rp9n+iNe8yeKrQTXEQ+S8iP2WKe26ZD+xl9+/S7kHYpXTDcAOzB4rJ13juIDdXaiZMn6+EOQ86j+QTw3W3HT5z4wWTEKj+k7Y95HGxr0Ca+OjG5VFTUC5aI0Ae8mfDadetD6tWrh0N1cCYlBBTXR+LeSW3Xrztnof78dVVpUZtF3fTDUJw/5lg5v8rycJiZc5JY2IGLkf3g7iee/SD4OW/lB6Sw477OYNRZbgL3D4QfuPMYPFzMR8FthGbj/XZO4c1VlsgT59cDg5FH5h+n8PjirFF0fMLmvzP/yxPHT7zIs0ADUVae+BMeYc3EYq0HsF0GK7S8B5gaGXnhQnzjRBwgQfqT9hUrVuCc6DqsJD7vvZRUTMWBAsV6sUx2AlnNZgcaRFcIsO0vDB7SiCsWORQnj1ijQGPjzBqK/UZaUBN0CzxqLXyHZBTSkj/gE3wVYfEAvxha0nAW6fLdv/3Wr1Kl6+rgpvWBWWP+n3/O0Do/P2iQ/+5du48GBvpjuBA7J0FAzh3Vr9/g7IsvjvgdNOLJ/15lUG664/SPuZ9++unkm266iV9TMKoLcRew787cCSfdjMNJN6Pcfr1hYuTAf9Ybb249dsAzTXnoOFdIZuIAhEXzFzUoO6JcDA7H7oih2Cu6IBlxNQgJClrVoH4DCDbug0RimCMUp56gOtLkyAdrLusm/nVhw5KzjvOdP0D29MTKTeymhCVOJaIQZDv36ncwZBqnRUeVerHOzTeLtLk1ITa2ola1alVuUxiE9LwNpXbs2DGrWrWq4lJqnjbFE5dwQPreNm3aHEPna6mXE5z93ZZvawwaNBiHcUsq8xvs2rFDs8XFXe/ltFR0RUwBwfqLOA9XlHyfvn0PfPbZZ9fzIGi0fCnc5LinZAy0pdYnGAV+yUDILQQXodBzC0mdidBdVHgEBC/BKBtuNk/n4pwfTp081eSKMvk/EAjaBi46ZkcC7FswaLGpOh4nBD3u6+KjU7QGyYoPyE30BqMxAx2Wjr5MN97mXMNaxZNmODIBTWRfVJT5RW+kGW93rmGHQmzVIElBUMo1HMogaGt08eRaSjvWeFRT1Fle9kyBJ6QR/FMgUQ5mcMyfaDSejbKa+4pAXv6Jj7dXAs3f5BI03jXJ3YRYyNLey8lcjs4Wb38ZjbSBHA1CtwBlB2GOYCjz2cuevPwQb094D9/bDJIiKaZnxJVe4T4ro5ezr6LzkAIlVhA++9xzQStXrkwWByOzwaMkrKd8IEOm0CN/oOAzGNFQOW4KNzJMLvPWPQuGIrz9R0jKjdTkObzCZ8y4cfFdu3b9HHvlHmUKChQFFAUUBRQFrh0KsKNTImHc2LF3L5z/7iu8CYHSjBqc0EiEEESRIAAF4tE9ZyGtxAATxSX1GDoKYSi60RB84g0m9w9xUQ7nPIYMHhw58Nln5UYyhikAYLl1H7sjyWB3XOzDYNj31sdul88FiEZ5VRRQFFAUUBTwEQUgLUouYF6mSf++fR756uuv+4VidV06tD4KRAo57hekyV9qf27tUAg+SES+418KUOmoW8AOElUMnQp/iAMrxkpHlcZNC61m3ly3LhbtSK9C0Iqw+jueGScFLhfiyOXlHJ0SmYIdhtKw2AJbCnDXWbrWpm27YHgPjLREFOiM05L7xVTOFQUUBRQFih8FwKFLLkAQBmOBQjKOvHKtX7dOrLpjgShwKJEof8SIKLQ7KRalkOJt9Zx3kSKTv/AIwSX8cBgVuqK8N5CRQShi6FUs1cbRYVxGTX/0xXMomY4Uunzktg5onAhDdzlHQ38YisUrNUyaPA6qe/eu2oSJEysghXK4h9FnJ68gfgWKAooCigKKAnlQoMQOjbJMFII0K8XG3loa+7q4qgtyBohfI67cwR8P2+awpxRzUhMUQorjqAApOBkK4eTkO8IgpHAWrmLUlBu2cRYhBJ1JCDsKN/ceRp4VyVNWKBjFPCWELLVCaoJcvMB9dbyFnBPtFKhVq1bWatWt0zD1UlojJQQF6dWPooCigKJAkVGgRAtCN9VwPmDb66tUbZiUlCJUQCEOqRUKOYYfCDaCEJCQcGLoEo605hCmfKcf4YMqnu6GKGiNd7oxOiEr8Sz8QrjxiZ55d6DYlygiZdxuP0gPWiYTMWCjsd3u1CpdV7Vl14e7NYspXWoVgytQFFAUUBRQFCg6CpC3l3jAkUfGE8dOutauXXNyxrQpZXkaB0ctMzEuKubqIML4J4QXRJc4lQZuYvk1hRz8CrlFiQgQ2yxginlCClT8IzIhzHSPQgAK73p4ETvVSCE5ERZhhNCEsBSCFhapl5K1fr37Jnbp2iOiYpVKBmi0DK1AUUBRQFFAUaAIKSA5fxFmwFtJQxhWRVxxjz/6WPz2bVtx4gWO3RKSipoc91pxnxNFIcAtrziJKCQgHSAYMYwqrsCBJyHT6FcHKSh1OUeqMaIspns4Vez9EvEybm7WoF/sO8PzLTffom3Y8LkBc5t3QQh+RycFigKKAooCigJFSwHKhmsCLOHhB4C2Ll279Q7CafEUUpRHlGhysy+HMamdScFIdzmUCVN4g7BEAKENwo0aJINLEOJTV/YYH23xI/91k771UNgULY5+E2lh/hDXxPAoqueee26gLd6xWAlBSVX1qyigKKAoUBwo8C+vLw658UIecNqIqVG9+s2Onzz+ZVSpSCxUofBDMSm0xEpRrvoEYMiSgs8EBwo2+hH6GzRHDoly1agYE+Uz/HBlKD1SjIp/ClgREcMyDi6MQRjGi7iEGOVCHaThdCRos+fNzWjdqnWg1WrGxsdiBzw5JyZLrhLwbAPyXrmLWexze2wAh4rZHM/h/RjwOLAgZbbCP2/9qA3kthJeh7UDyA+SH3A7SpssnnAquGYH8mxIT+7IY8ewEzA3YHl+zs1Rt+cZp1mPLmQeeAvGUSBpkh+0hAdzHp52we1QLu7NYB8JPAHcns2P+xszL9uyuRX0tQ4CVAfybqrvswUujfe7gPzmnwLz+2414acS8AzwB6CnwPTLAI8A+V0KAtfD8y3A7LSIhl1ToBP4JdBTYH29DpgTPXKK4wZY1srJQbdjff0uD3eGZRwHgL/m4S+rE1eo847NGkC2Sbap/UBPoBw83Q7MThfWc9Z3LlpcD8wPyDFJq7pA1tMjwM+BPrmdBvH+7wIEYZ1DBw+XfurpASm4X9AVGxvrqlC+vMDywqzgii0vsQJM6QazAuyIdKtQXjd1e4Sjm/QPs5zuj/buuGgnwscKu4qxeIddubLlXG3atHO9u2RJOZvNcWsx/TK8QZ4MKzsehF0jD/L8Xg5h3XF9A7coD+Kgl4eBFMDusG6T+WNDzg/KwoM7THbzQ7hF5BNBQB7hGR/LmR9QeGdP2/0+AW4UtnnBb3B0+8/J7JtH4Mf0sOzIlM/ij4w/VXejsLxa4BFjzFs8kDTLCsPwQrevslrm8kxaHAHSP+mGoRyPYT58MtxIj0P86/EpPWz2xWqkDePc+6/XfJ9YhsNAhqOgCAXmB8Phgf5zw2/yiWCSHvb1fPzRmfkbC2THJHt6b8DOE5q7vzfDs0PlhjA80I4dr/wgEB6WArPngZ1DT3hMfvFflTsl+jUFuKVij82ZWG7S5Mlh69av+Sf90qXKRtxQwCFPXtMjtDqhsaHY0ODEjfZ4dC+qEd8JWqFQIhnGTR2h/uEbwoJzjlIz5DApNEbaIQC/MA+H5P18jMfgh0s9/YM1a6TV74mePTOe0LRT7uiKqfkB8rUTyAreFXgTcBawIdAT+AyeNgNNQAuQDOdu4CDgK8C8oDEcPwKSeMuBa4HUjAYC7wN+CmQ+2KA9gefgiUw6FtgH2A34PXAO0BN4EZ6Ssnn8O9t7Xq8T4ciePWlRHUgBRqZNGv0CzA2mwKGU7vgsTAqxJcBdut023czJeA+WFIbNgVOBPYCE6UDSgvHw+1wtsGNCIchefQsge/VueEh/eN9tkYfJfFbS3SNgsiO0WH8vKcY9yOh1embDYXYBvqu/52ZsggPrJ+EOIMtN4TsfSDgpDa/8sg6NAnJk4jUg6x7r1FAg2xbb2wCgpzAbHtmhT/M0gO7vAZiPAv8CMh82YH9gM+Ai4I1ABd6mQHy84+yWLd8viTBHuCrFVoQWV05gebfW9x/tMNZVEfYVy5dzUWuUWiE0O+GX79QopcZXEVpe+cuaJDVF6f+yZgm/FaGFMqw5wuwaM3ocmXpxBzI2ynEyUTdQA6MdMdptmYtJBkx/Q7K5UwDS/uts9jm9fgtL+mVDywpkLuxA0O1xYF5QFo70l11YjtTt1+UVGG4UFgxPtACvBKjZMHy1bIHJ/GhPxuQpfAuPDENG6Skw3RQgwzUFUlDx+QLQLWDxeNUwFzEwXgpXN1yHB9olAynY8oOP4YH++V1obgV6ChQaDMNvW1Dwpkb4IRLPWoa8Oio55bOfHp4dPU9hEjwy5oo09wAACdxJREFUzdfzCeAP94u630ey+a2L90wg20p+Qqg9/DA9Nw7GM4EdZtqd4Es+MAPu9EshaND9xsL8HLgCGKzbFYnB3sA1CZGR5piatWqPuL1R44nxuGnaxf0U0No433dZz+PnwKfhDCCm9vDLc0ip2UmdTxCGmh7VQwBrDRVDGYy/cGN4apa0xZwgtUFeDZWKU2hwa7b23OBBM3C+aEmks5Vl1qGgV/iQOKHAO/Tw3+lmbgb936I7zszmicN87+p2TbK5efoapXssSDnuRhgKkayYlSZ6lPkaLNt1wOq6z/xooXu7YmM/Qo7XQ78J080sybwoDL0FH+gRPQAzSH/urJtrYDr159wMfpOOQArNXkAHkPNQtYAlBVgfOgHZ8WAZ7MBGwDrA4gA1kIkQ4DkgBXZW+A0v3wLJm0h3T4B1izAWyI5yQeBH3fMgmL8DRwApqFsDOYrAelBkUBIZtMfEwikwrZctW5Fw9z13aen64dzcDkiRJoQb+ydc4EIhJiQinsU7PFHAEeFCoI8s4lG8S09wcUtHDokiEMUiL0xt2KjenVZzxE9AkaqIqHj/9EX2qN19AfxezypNNnBPYAI80S8ZQyLwQeCvwCXAvKAiHKlBpAMP5+DxoG7Hhu0JsF4vAlIbZw/9eSBhrTQ8+v0Evr7KhuxFewo74ZG0cJepPJ5J2z1AX8M0JLAPSIZcE7gJyLS9CVsR2TEgv9t9esT83gS3kJRvOf/2gHUA8FPgeeAyIIF1sKQAyxAI/AzIMlDDJRSXMtSW2dH+gZkTDypou9qOeNiWqQnOBBYEVsPzWCA7SKyTrwKZ/i/Am4BFCte0ILRawheaLRFTrq9U2T88JOSSOCUUt2hDdEHeQWBxco+AZ3FcGt6FZgcrIdOENKRfWuCHmiH/3Y/wZDQxLOJCNWMcRsSfmpysfbN5U3yrVm0KMqTFnBQ13IkMPAK8F2gGUiAWpAzH4Z+VmwyOMBZ4K5AMMy9w10MTPPnn4DFEtytIr/FxhGFPkz30BOAo4GKgpzAJHl/Jhoc9DQx/FETxQJaNmmgT4GNA1iZfA9MbkCUR91BgFqurfiRj/VCPpQvMWCBpzTJvBOYFbHh9dA/scJCxrtLfSSNfD5Ol6WmxvmUF9zvplx/kVYZHEdhdZ/OLx5fu7naVGz3deSxIuxqKDNuAbFvuDpAnZWC9HwOsABwI/BpIOtcDfg8MBxYZuAlVZBkojITHjJ+4cc7cuV85EhM0fzHUiVQptLDfj9siLi90cbMoCjw88wQa1nYBWEBzmYVRElJdpGZJbRCPYvMF4ruYmKi1vPfePafPnCuDW9Kf00OXFGM4MlodWAbInm4r4BmgpzAPHm8DujWDl/Dc2oPAR+GHjZHkrp+DfwpTwt/SyPeXH4fluB7I4SsLcDyQ9p7CNHikhpsVmU9PgQy9GnARMABIoUG6Fha4aZWOBPf7KNEP9HjbwyTzJ6wA5idIyPzc2spyPLOjwk4Xgd/KXX+EhQ9+LuhxhmaLmwKZQEafH7BO1tU9URNkGb7S380wKSiKGv7QM3AjTOYpK5D336JbuOtKVvfcns/DYYTu+HpunnKw7w478hcK37eALYGVgUeAkcA7gEUG/xOCEDdKt6jfqNG87t16bHZCGIqhTJBczOxRmyP75SQh7agdiidwZThQJop3+OPQqJhj/NfyMmvl3kHePFG1enXto48+qtu0yZ3uXqceW4kwKPTINM8C82NmeRWIvXtWdn/gYmB+AoDaBYdOCFOBWRttI7xTqBDcfuRb7r/8mCzHIaAdyPiLAjKQKHu/fwErAhcC3dULjyUe9qIEe4AUKCP10riFo/6ao9FbtyWjXp8Fd+v2fXXTVwaZOaEhsJx4kj9N9Oe4LHa5PbrL8Cc8ZC3DLj2Ar8uQW76y2u/Dyz9ACh+2KxPQDU/jgQLSCdzktvTQXAB/24HU7jwFtoPJwGFZApDOxUIG+WXJ1DX9iNNc1qKAa+vXb+g6deo4uBHpD55ElklhiFdx0gyFnLCngJRCUdjTP50uC0o5YyiCixBG7YItTmvdrsOT27dtg83/PLD3x6GTasC3gZ2BecFQOLYGUvCxAXPohNrc/UDWU2pUm4GFBWTo2Tszx2HHBl0QuAjPPYGsFCwfnxcDrxUgneoAQ4DHgFuBeQH9ddM9PArTLThoRaFEGlMgkUlTyOQHj8BD/WyefsT71Gx2WV9/xgs7SVWAFL6sa2TqdwIJLFNeEAzH7rqHx2DuyOKZnb4TwDuANYGsy0UFl5Dw08Avgf2AjYE/AasDmwIJLwHPiifPfzLhtT9wJzCrcM0rhjfgyLY9GEjasBPVDFgRSIH4LVBBYVDAZnO23/bT9lZVq1VzlSpV2hUVVcpltUa6IiOBNK1W8Wy18DnqMlojo1xW+BEIf1HCrwzHeKJLl3ZZzBbXu+8uolwsibARmWbe2aivBN5DIIYfki0wGQsbDd3aZnPL6TUWluywZAAZhsgeK4WqJ522snoYhr8SCEAgd7o5mZ4wNYceR7VsGXhVt+ewXKlsbrm9fgsH5qMg87TuuNy0yC7M3e7eMvnN3LRiGfMD1jH6Jy1z0o7X6e4zYeYF8+HoTje7uSKvgLobvw+FQtawSXhnHUavN094BK4MR0GdUxnW6O6eDB1SQDGuT4GewiR4ZBhP4mecDYG/ArOWlZ2WjkBPoD08MezSbJ75jWhPwe8JPAdPNmDWfFCYVvUksC/95PQRfZlesYi7U6dOT3//ww+V/TCUyUt3Dbgj0GDAYWughjhrFA+8N5Bfiz80eXwa5wPxK/1wNQ20RwOPVINdmTJltKf6P/VqpwcfrBUVadlSLArqeSbC4ZWChowg1fNgl31yaIxCJBmYctlWPphhgFhiqPViNrfcXoPgUB1IIXgMSGHqCTAdpkdggysosD1Y8gjEfFDQ5QXUYgnMe1aBzJ5zBB0ApAN76/mB+7t46j9rfFdLi6xx5fdMmpF2nuSTGmEgkOXPqT5Q2+L3J+1Iw9zAXedycqfwT8zJIQc7xkOhmAA8Asz6zfCaI7jLkFs6npaBkZMWjC+3uOgnO7jjZ1tlm/UU2DYodKh1n/M0EPyxbZNO2b8ZeQbrKFmkHegJMK5KQOblbyDprkBRQFFAUUBRQFFAUUBRQFFAUUBRQFFAUUBRQFFAUUBRQFFAUUBRQFFAUUBRQFFAUUBRQFFAUUBRQFFAUUBRQFFAUUBRQFFAUUBRQFFAUUBRQFFAUUBRQFFAUUBRQFFAUUBRQFFAUUBRQFFAUUBRQFFAUUBRQFFAUUBRQFFAUUBRQFFAUUBRQFFAUUBRQFFAUUBRQFFAUUBRQFFAUUBRQFFAUUBRQFFAUUBRQFFAUUBRQFFAUeBqKfB/aKBmAUWDBAUAAAAASUVORK5CYII=';

export function generateReportHtml(sections: ReportSection[]): string {
  const coverSection = sections.find(s => s.id === 'cover');
  const execSection = sections.find(s => s.id === 'exec');
  const imageMgtSection = sections.find(s => s.id === 'image-mgt');

  // Helper function to get field value from a specific section
  const getFieldValue = (section: ReportSection | undefined, fieldId: string): string => {
    if (!section) return '';

    // Check main fields
    const mainField = section.fields.find(f => f.id === fieldId);
    if (mainField) return String(mainField.value || '');

    // Check subsection fields
    if (section.subsections) {
      for (const subsection of section.subsections) {
        const subField = subsection.fields.find(f => f.id === fieldId);
        if (subField) return String(subField.value || '');
      }
    }

    return '';
  };

  // Helper function to get any field value from ALL sections (for images that may be in image-mgt)
  const getGlobalFieldValue = (fieldId: string): any => {
    for (const section of sections) {
      // Check main fields
      const mainField = section.fields.find(f => f.id === fieldId);
      if (mainField && mainField.value) return mainField.value;

      // Check subsection fields
      if (section.subsections) {
        for (const subsection of section.subsections) {
          const subField = subsection.fields.find(f => f.id === fieldId);
          if (subField && subField.value) return subField.value;
        }
      }
    }
    return undefined;
  };

  // Cover page fields
  const propertyType = getFieldValue(coverSection, 'property-type-display');
  const propertyName = getFieldValue(coverSection, 'property-name');
  const streetAddress = getFieldValue(coverSection, 'street-address');
  const city = getFieldValue(coverSection, 'city');
  const province = getFieldValue(coverSection, 'province');
  const clientContactName = getFieldValue(coverSection, 'client-contact-name');
  const clientCompany = getFieldValue(coverSection, 'client-company');
  const clientAddress = getFieldValue(coverSection, 'client-address');
  const clientCity = getFieldValue(coverSection, 'client-city');
  const clientProvince = getFieldValue(coverSection, 'client-province');
  const clientPostal = getFieldValue(coverSection, 'client-postal');
  const appraiserCompany = getFieldValue(coverSection, 'appraiser-company');
  const appraiserAddress = getFieldValue(coverSection, 'appraiser-address');
  const appraiserPhone = getFieldValue(coverSection, 'appraiser-phone');
  const appraiserWebsite = getFieldValue(coverSection, 'appraiser-website');
  const valuationDate = getFieldValue(coverSection, 'valuation-date');
  const reportDate = getFieldValue(coverSection, 'report-date');
  const fileNumber = getFieldValue(coverSection, 'file-number');

  // Letter of Transmittal additional fields
  const valueScenario = getFieldValue(execSection, 'value-scenario') || 'As Stabilized';
  const propertyRights = getFieldValue(execSection, 'property-rights') || 'Fee Simple Estate';
  const buildingStyle = getFieldValue(execSection, 'building-style') || 'walkup';
  const totalBuildings = getFieldValue(execSection, 'total-buildings') || '1';
  const totalNra = getFieldValue(execSection, 'total-nra') || '';
  const yearBuilt = getFieldValue(execSection, 'year-built') || '';
  const occupancyRate = getFieldValue(execSection, 'occupancy-rate') || '100';
  const totalUnits = getFieldValue(execSection, 'total-units') || '';
  const stories = getFieldValue(execSection, 'stories') || '1';
  const buildingFormat = getFieldValue(execSection, 'building-format') || 'garden style';
  const concludedValue = getFieldValue(execSection, 'concluded-value') || '';
  const hypotheticalConditions = getFieldValue(execSection, 'hypothetical-conditions') || 'No Hypothetical Conditions were made for this assignment.';
  const extraordinaryAssumptions = getFieldValue(execSection, 'extraordinary-assumptions') || 'No Extraordinary Assumptions were made for this assignment.';
  const extraordinaryLimitingConditions = getFieldValue(execSection, 'extraordinary-limiting-conditions') || 'No Extraordinary Limiting Conditions were made for this assignment.';
  const appraiserName = getFieldValue(coverSection, 'appraiser-name') || '';
  const appraiserCredentials = getFieldValue(coverSection, 'appraiser-credentials') || '';
  const appraiserTitle = getFieldValue(coverSection, 'appraiser-title') || '';
  const appraiserEmail = getFieldValue(coverSection, 'appraiser-email') || '';
  const appraiserAicNumber = getFieldValue(coverSection, 'appraiser-aic-number') || '';

  // Formatting helpers
  const formatCurrency = (value: string): string => {
    if (!value) return '';
    const num = parseFloat(value.replace(/[^0-9.-]/g, ''));
    if (isNaN(num)) return value;
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(num);
  };

  const formatPercent = (value: string): string => {
    if (!value) return "";
    const num = parseFloat(value.replace(/[^0-9.-]/g, ""));
    if (isNaN(num)) return value;
    return `${num.toFixed(1)}%`;
  };

  const propertyTypeLower = propertyType.toLowerCase();
  const appraiserCompanyShort = appraiserCompany.split(' ')[0] || appraiserCompany;

  // Extract cover photo from the img-cover-photo field (may be in cover or image-mgt section)
  const coverPhotoValue = getGlobalFieldValue('img-cover-photo');
  const coverPhoto = typeof coverPhotoValue === 'string' && coverPhotoValue ? coverPhotoValue :
                     (Array.isArray(coverPhotoValue) && coverPhotoValue.length > 0 ? coverPhotoValue[0] : null);

  // Helper function to render the SITE section with custom template
  // Helper function to render the SITE section with custom template - EXPANDED VERSION
  const renderSiteSection = (section: ReportSection): string => {
    // Get field values from subsections - EXISTING FIELDS
    const siteAreaSf = getFieldValue(section, 'site-total-area');
    const siteAcreage = getFieldValue(section, 'site-acreage');
    const siteAddress = getFieldValue(section, 'site-address') || `${streetAddress}, ${city}, ${province}`;
    const siteShape = getFieldValue(section, 'site-shape');
    const topography = getFieldValue(section, 'topography');
    const accessibility = getFieldValue(section, 'accessibility');
    const exposureVisibility = getFieldValue(section, 'exposure-visibility');

    // Adjacent uses
    const adjacentNorth = getFieldValue(section, 'adjacent-north');
    const adjacentSouth = getFieldValue(section, 'adjacent-south');
    const adjacentEast = getFieldValue(section, 'adjacent-east');
    const adjacentWest = getFieldValue(section, 'adjacent-west');

    // Site conditions
    const easements = getFieldValue(section, 'easements');
    const soils = getFieldValue(section, 'soils');
    const hazardousWaste = getFieldValue(section, 'hazardous-waste');
    const siteRating = getFieldValue(section, 'site-rating');
    const siteConclusion = getFieldValue(section, 'site-conclusion');

    // Site plan images
    const sitePlanImages = section.subsections
      ?.find(s => s.id === 'site-plan-images')
      ?.fields.find(f => f.id === 'site-plan-image')?.value as string[] || [];

    // Get IMPROVEMENTS section fields (for site improvements, parking, landscaping)
    const improvementsSection = sections.find(s => s.id === 'improvements');
    const siteImprovements = improvementsSection ? getFieldValue(improvementsSection, 'site-impv') : '';
    const landscaping = improvementsSection ? getFieldValue(improvementsSection, 'landscaping') : '';
    const parkingSpaces = improvementsSection ? getFieldValue(improvementsSection, 'parking-spaces') : '';
    const parkingRatio = improvementsSection ? getFieldValue(improvementsSection, 'parking-ratio') : '';
    const siteCoverage = improvementsSection ? getFieldValue(improvementsSection, 'impv-site-coverage') : '';

    return `
    <div class="section">
      <h2 class="section-title">Site Details</h2>

      <!-- PAGE 1: SITE OVERVIEW (0.5 page) -->
      <div class="site-overview-intro" style="margin-bottom: 2rem;">
        <p class="site-narrative-text">
          The subject property consists of ${siteAcreage ? `${Number(siteAcreage).toFixed(2)} acres (${siteAreaSf ? Number(siteAreaSf).toLocaleString() + ' SF' : ''})` : siteAreaSf ? `${Number(siteAreaSf).toLocaleString()} SF` : 'one parcel'} which is based on information obtained from property records. For the purposes of this report, we have relied on this site area and reserve the right to amend our analysis upon receipt of a formal legal plan. The following summarizes the salient characteristics of the subject site.
        </p>
      </div>

      <!-- PAGE 1-2: PHYSICAL CHARACTERISTICS TABLE (1 page) -->
      <h3 class="subsection-title">Physical Characteristics</h3>
      <table class="site-table">
        <tbody>
          <tr>
            <td class="site-table-label" style="width: 35%;">Address</td>
            <td class="site-table-value">${siteAddress || '<span class="empty-state">—</span>'}</td>
          </tr>
          <tr>
            <td class="site-table-label">Site Area</td>
            <td class="site-table-value">
              ${siteAreaSf ? `${Number(siteAreaSf).toLocaleString()} SF` : ''}
              ${siteAreaSf && siteAcreage ? ' / ' : ''}
              ${siteAcreage ? `${Number(siteAcreage).toFixed(4)} AC` : ''}
              ${!siteAreaSf && !siteAcreage ? '<span class="empty-state">—</span>' : ''}
            </td>
          </tr>
          <tr>
            <td class="site-table-label">Shape</td>
            <td class="site-table-value">${siteShape || '<span class="empty-state">—</span>'}</td>
          </tr>
          <tr>
            <td class="site-table-label">Topography</td>
            <td class="site-table-value">${topography || '<span class="empty-state">—</span>'}</td>
          </tr>
          <tr>
            <td class="site-table-label">Frontage</td>
            <td class="site-table-value">${exposureVisibility || '<span class="empty-state">—</span>'}</td>
          </tr>
          <tr>
            <td class="site-table-label">Access Points</td>
            <td class="site-table-value">${accessibility || '<span class="empty-state">—</span>'}</td>
          </tr>
          <tr>
            <td class="site-table-label">Corner Lot Status</td>
            <td class="site-table-value"><span class="empty-state">—</span></td>
          </tr>
        </tbody>
      </table>

      <!-- Adjacent Properties Sub-table -->
      <h3 class="subsection-title" style="margin-top: 1.5rem;">Adjacent Properties</h3>
      <table class="site-table">
        <tbody>
          <tr>
            <td class="site-table-label" style="width: 35%;">North</td>
            <td class="site-table-value">${adjacentNorth || '<span class="empty-state">Residential</span>'}</td>
          </tr>
          <tr>
            <td class="site-table-label">South</td>
            <td class="site-table-value">${adjacentSouth || '<span class="empty-state">Residential</span>'}</td>
          </tr>
          <tr>
            <td class="site-table-label">East</td>
            <td class="site-table-value">${adjacentEast || '<span class="empty-state">Residential</span>'}</td>
          </tr>
          <tr>
            <td class="site-table-label">West</td>
            <td class="site-table-value">${adjacentWest || '<span class="empty-state">Residential</span>'}</td>
          </tr>
        </tbody>
      </table>

      <!-- Accessibility and Exposure Details -->
      <div style="margin-top: 1.5rem;">
        <h4 class="site-narrative-label">Accessibility</h4>
        <p class="site-narrative-text">${accessibility || 'Access to the subject site is considered average overall.'}</p>

        <h4 class="site-narrative-label" style="margin-top: 1rem;">Exposure & Visibility</h4>
        <p class="site-narrative-text">${exposureVisibility || 'Exposure of the subject is considered average.'}</p>
      </div>

      <div class="page-break"></div>

      <!-- PAGE 2-3: UTILITIES (0.5 page) -->
      <h3 class="subsection-title" style="margin-top: 2rem;">Utilities</h3>
      <table class="site-table">
        <tbody>
          <tr>
            <td class="site-table-label" style="width: 35%;">Water</td>
            <td class="site-table-value"><span class="empty-state">Municipal - Available</span></td>
          </tr>
          <tr>
            <td class="site-table-label">Sewer</td>
            <td class="site-table-value"><span class="empty-state">Municipal - Available</span></td>
          </tr>
          <tr>
            <td class="site-table-label">Electric</td>
            <td class="site-table-value"><span class="empty-state">Available</span></td>
          </tr>
          <tr>
            <td class="site-table-label">Gas</td>
            <td class="site-table-value"><span class="empty-state">Available</span></td>
          </tr>
          <tr>
            <td class="site-table-label">Phone/Internet</td>
            <td class="site-table-value"><span class="empty-state">Available</span></td>
          </tr>
        </tbody>
      </table>

      <!-- PAGE 3: ENVIRONMENTAL (1 page) -->
      <h3 class="subsection-title" style="margin-top: 2rem;">Environmental Conditions</h3>

      ${soils || true ? `
        <div class="site-narrative-section">
          <h4 class="site-narrative-label">Soils</h4>
          <p class="site-narrative-text">${soils || 'We have not undertaken a detailed soil analysis and we are not qualified to comment on soil conditions. As such, the soils are assumed to be similar to other lands in the area and suitable in drainage qualities and load bearing capacity to support the existing development.'}</p>
        </div>
      ` : ''}

      <div class="site-narrative-section" style="margin-top: 1rem;">
        <h4 class="site-narrative-label">Flood Zone Status</h4>
        <p class="site-narrative-text"><span class="empty-state">Based on available flood maps, the subject property is not located within a designated flood hazard area. Flood zone information should be verified with local authorities if required for specific purposes.</span></p>
      </div>

      ${hazardousWaste || true ? `
        <div class="site-narrative-section" style="margin-top: 1rem;">
          <h4 class="site-narrative-label">Hazardous Waste</h4>
          <p class="site-narrative-text">${hazardousWaste || 'Based on a review of an independent investigation to determine the presence or absence of toxins on the subject property, none are present. If questions arise, the reader is strongly cautioned to seek qualified professional assistance in this matter. Please see the Assumptions and Limiting Conditions for a full disclaimer.'}</p>
        </div>
      ` : ''}

      <div class="site-narrative-section" style="margin-top: 1rem;">
        <h4 class="site-narrative-label">Wetlands Status</h4>
        <p class="site-narrative-text"><span class="empty-state">No wetlands are known to exist on the subject property based on available environmental records and site inspection. Formal wetland delineation has not been conducted as part of this appraisal.</span></p>
      </div>

      <div class="page-break"></div>

      <!-- PAGE 4: EASEMENTS & ENCUMBRANCES (0.5 page) -->
      <h3 class="subsection-title" style="margin-top: 2rem;">Easements & Encumbrances</h3>
      ${easements || true ? `
        <div class="site-narrative-section">
          <p class="site-narrative-text">${easements || 'A legal opinion regarding title information was not provided or commissioned in conjunction with this assignment. Under the scope of this appraisal, it is assumed that any legal notations and registered charges on title do not adversely affect the highest and best use of the subject property as described herein, unless otherwise noted. If there is any concern on the part of the reader with respect to the status of title, we recommend a legal opinion be obtained. A copy of the subject property title has been inserted in the appendix to this report if further information is required.'}</p>
        </div>
      ` : ''}

      <!-- PAGE 4-5: SITE IMPROVEMENTS (1 page) -->
      <h3 class="subsection-title" style="margin-top: 2rem;">Site Improvements</h3>

      <div class="site-narrative-section">
        <h4 class="site-narrative-label">Parking</h4>
        <table class="site-table" style="margin-top: 0.5rem;">
          <tbody>
            <tr>
              <td class="site-table-label" style="width: 35%;">Parking Type</td>
              <td class="site-table-value">${siteImprovements ? (siteImprovements.toString().toLowerCase().includes('paved') ? 'Paved surface parking' : siteImprovements.toString().toLowerCase().includes('gravel') ? 'Gravel surface parking' : 'Surface parking') : '<span class="empty-state">Surface parking</span>'}</td>
            </tr>
            <tr>
              <td class="site-table-label">Total Spaces</td>
              <td class="site-table-value">${parkingSpaces || '<span class="empty-state">—</span>'}</td>
            </tr>
            <tr>
              <td class="site-table-label">Parking Ratio</td>
              <td class="site-table-value">${parkingRatio ? `${parkingRatio} spaces per unit` : '<span class="empty-state">—</span>'}</td>
            </tr>
          </tbody>
        </table>
        ${parkingSpaces ? `
          <p class="site-narrative-text" style="margin-top: 0.5rem;">
            The subject provides ${parkingSpaces} parking spaces${parkingRatio ? ` and is therefore conforming to zoning requirements. The parking ratio of ${parkingRatio} per unit is within the typical range of spaces per unit and within zoning requirements` : ''}.
          </p>
        ` : ''}
      </div>

      ${landscaping || true ? `
        <div class="site-narrative-section" style="margin-top: 1.5rem;">
          <h4 class="site-narrative-label">Landscaping</h4>
          <p class="site-narrative-text">${landscaping || 'Landscaping around the building perimeter consists of shrubs and trees. The landscaping as proposed is well established and well maintained.'}</p>
        </div>
      ` : ''}

      <div class="site-narrative-section" style="margin-top: 1.5rem;">
        <h4 class="site-narrative-label">Fencing</h4>
        <p class="site-narrative-text"><span class="empty-state">Standard perimeter fencing consistent with the property type and local area standards.</span></p>
      </div>

      <div class="site-narrative-section" style="margin-top: 1.5rem;">
        <h4 class="site-narrative-label">Lighting</h4>
        <p class="site-narrative-text"><span class="empty-state">Exterior lighting is provided for parking areas, walkways, and building entrances for security and safety purposes.</span></p>
      </div>

      <div class="site-narrative-section" style="margin-top: 1.5rem;">
        <h4 class="site-narrative-label">Signage</h4>
        <p class="site-narrative-text"><span class="empty-state">Property identification signage is present and conforms to local signage ordinances.</span></p>
      </div>

      ${siteCoverage ? `
        <div class="site-narrative-section" style="margin-top: 1.5rem;">
          <h4 class="site-narrative-label">Site Coverage Ratio</h4>
          <p class="site-narrative-text">${siteCoverage}%, which is within market standards (20-35%) for similar properties in the area.</p>
        </div>
      ` : ''}

      ${siteImprovements ? `
        <div class="site-narrative-section" style="margin-top: 1.5rem;">
          <h4 class="site-narrative-label">General Site Improvements</h4>
          <p class="site-narrative-text">${siteImprovements}</p>
        </div>
      ` : ''}

      <div class="page-break"></div>

      <!-- PAGE 5: SITE RATING & CONCLUSION (0.5 page) -->
      ${siteRating || true ? `
        <h3 class="subsection-title" style="margin-top: 2rem;">Site Rating</h3>
        <div class="site-narrative-section">
          <p class="site-narrative-text">${siteRating || 'Overall, the subject site is considered average for its property type in terms of location, exposure, and access to employment, education, and shopping centers, based on its location characteristics.'}</p>
        </div>
      ` : ''}

      ${siteConclusion || true ? `
        <h3 class="subsection-title" style="margin-top: 1.5rem;">Site Conclusion</h3>
        <div class="site-narrative-section">
          <p class="site-narrative-text">${siteConclusion || 'In conclusion, the site\'s physical characteristics appear to be supportive of the subject\'s current use and there were no significant detriments discovered that would inhibit development in accordance with its highest and best use.'}</p>
        </div>
      ` : ''}

      <!-- Site Plan Images -->
      ${sitePlanImages.length > 0 ? `
        <h3 class="subsection-title" style="margin-top: 2rem;">Site Plans</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1rem; margin-top: 1rem;">
          ${sitePlanImages.map((url, index) => `
            <div style="border: 1px solid #e5e7eb; border-radius: 4px; overflow: hidden;">
              <img src="${url}" alt="Site Plan ${index + 1}" style="width: 100%; height: 250px; object-fit: cover;" />
            </div>
          `).join('')}
        </div>
      ` : ''}
    </div>
    `;
  };


  // Helper function to render the ASSIGNMENT section (CUSPAP mandatory)
  const renderAssignmentSection = (section: ReportSection): string => {
    // Get field values from subsections
    const propertyLegal = getFieldValue(section, 'assignment-property-legal');
    const propertyAddress = getFieldValue(section, 'assignment-property-address');
    const propertyType = getFieldValue(section, 'assignment-property-type');
    const propertyInterest = getFieldValue(section, 'assignment-property-interest');
    
    const clientName = getFieldValue(section, 'assignment-client-name');
    const clientAddress = getFieldValue(section, 'assignment-client-address');
    const intendedUse = getFieldValue(section, 'assignment-intended-use');
    const intendedUsers = getFieldValue(section, 'assignment-intended-users');
    
    const inspectionDate = getFieldValue(section, 'assignment-inspection-date');
    const inspectionType = getFieldValue(section, 'assignment-inspection-type');
    const inspectorName = getFieldValue(section, 'assignment-inspector-name');
    const dataSources = getFieldValue(section, 'assignment-data-sources');
    const analysisMethods = getFieldValue(section, 'assignment-analysis-methods');
    
    const effectiveDate = getFieldValue(section, 'assignment-effective-date');
    const reportDate = getFieldValue(section, 'assignment-report-date');
    
    const hypotheticalConditions = getFieldValue(section, 'assignment-hypothetical');
    const extraordinaryAssumptions = getFieldValue(section, 'assignment-extraordinary-assumptions');
    const generalAssumptions = getFieldValue(section, 'assignment-general-assumptions');
    const limitingConditions = getFieldValue(section, 'assignment-limiting-conditions');

    return `
    <div class="section">
      <h2 class="section-title">Identification of Assignment</h2>

      <!-- Property Identification -->
      <h3 class="subsection-title">Property Identification</h3>
      <table class="site-table">
        <tbody>
          <tr>
            <td class="site-table-label">Legal Description</td>
            <td class="site-table-value">${propertyLegal || '<span class="empty-state">—</span>'}</td>
          </tr>
          <tr>
            <td class="site-table-label">Property Address</td>
            <td class="site-table-value">${propertyAddress || '<span class="empty-state">—</span>'}</td>
          </tr>
          <tr>
            <td class="site-table-label">Property Type</td>
            <td class="site-table-value">${propertyType || '<span class="empty-state">—</span>'}</td>
          </tr>
          <tr>
            <td class="site-table-label">Property Interest</td>
            <td class="site-table-value">${propertyInterest || '<span class="empty-state">—</span>'}</td>
          </tr>
        </tbody>
      </table>

      <!-- Client & Intended Use -->
      <h3 class="subsection-title" style="margin-top: 1.5rem;">Client & Intended Use</h3>
      <table class="site-table">
        <tbody>
          <tr>
            <td class="site-table-label">Client</td>
            <td class="site-table-value">${clientName || '<span class="empty-state">—</span>'}</td>
          </tr>
          <tr>
            <td class="site-table-label">Client Address</td>
            <td class="site-table-value">${clientAddress || '<span class="empty-state">—</span>'}</td>
          </tr>
        </tbody>
      </table>
      
      ${intendedUse ? `
        <div class="site-narrative-section">
          <h4 class="site-narrative-label">Intended Use</h4>
          <p class="site-narrative-text">${intendedUse}</p>
        </div>
      ` : ''}
      
      ${intendedUsers ? `
        <div class="site-narrative-section">
          <h4 class="site-narrative-label">Intended Users</h4>
          <p class="site-narrative-text">${intendedUsers}</p>
        </div>
      ` : ''}

      <!-- Scope of Work -->
      <h3 class="subsection-title" style="margin-top: 1.5rem;">Scope of Work</h3>
      <table class="site-table">
        <tbody>
          <tr>
            <td class="site-table-label">Inspection Date</td>
            <td class="site-table-value">${inspectionDate || '<span class="empty-state">—</span>'}</td>
          </tr>
          <tr>
            <td class="site-table-label">Inspection Type</td>
            <td class="site-table-value">${inspectionType || '<span class="empty-state">—</span>'}</td>
          </tr>
          <tr>
            <td class="site-table-label">Inspector</td>
            <td class="site-table-value">${inspectorName || '<span class="empty-state">—</span>'}</td>
          </tr>
        </tbody>
      </table>
      
      ${dataSources ? `
        <div class="site-narrative-section">
          <h4 class="site-narrative-label">Data Sources</h4>
          <p class="site-narrative-text">${dataSources}</p>
        </div>
      ` : ''}
      
      ${analysisMethods ? `
        <div class="site-narrative-section">
          <h4 class="site-narrative-label">Analysis Methods</h4>
          <p class="site-narrative-text">${analysisMethods}</p>
        </div>
      ` : ''}

      <!-- Effective Dates -->
      <h3 class="subsection-title" style="margin-top: 1.5rem;">Effective Dates</h3>
      <table class="site-table">
        <tbody>
          <tr>
            <td class="site-table-label">Effective Date of Value</td>
            <td class="site-table-value">${effectiveDate || '<span class="empty-state">—</span>'}</td>
          </tr>
          <tr>
            <td class="site-table-label">Report Date</td>
            <td class="site-table-value">${reportDate || '<span class="empty-state">—</span>'}</td>
          </tr>
        </tbody>
      </table>

      <!-- Assumptions & Conditions -->
      <h3 class="subsection-title" style="margin-top: 1.5rem;">Assumptions & Limiting Conditions</h3>
      
      ${hypotheticalConditions ? `
        <div class="site-narrative-section">
          <h4 class="site-narrative-label">Hypothetical Conditions</h4>
          <p class="site-narrative-text">${hypotheticalConditions}</p>
        </div>
      ` : ''}
      
      ${extraordinaryAssumptions ? `
        <div class="site-narrative-section">
          <h4 class="site-narrative-label">Extraordinary Assumptions</h4>
          <p class="site-narrative-text">${extraordinaryAssumptions}</p>
        </div>
      ` : ''}
      
      ${generalAssumptions ? `
        <div class="site-narrative-section">
          <h4 class="site-narrative-label">General Assumptions</h4>
          <p class="site-narrative-text">${generalAssumptions}</p>
        </div>
      ` : ''}
      
      ${limitingConditions ? `
        <div class="site-narrative-section">
          <h4 class="site-narrative-label">Limiting Conditions</h4>
          <p class="site-narrative-text">${limitingConditions}</p>
        </div>
      ` : ''}
    </div>
    `;
  };

  // Helper function to render the TAX section with custom template
  const renderTaxSection = (section: ReportSection): string => {
    // Get field values from subsections
    const assessmentYear = getFieldValue(section, 'assessment-year');
    const landAssessment = getFieldValue(section, 'land-assessment');
    const buildingAssessment = getFieldValue(section, 'building-assessment');
    const totalAssessment = getFieldValue(section, 'total-assessment');
    const millRate = getFieldValue(section, 'mill-rate');
    const annualTaxes = getFieldValue(section, 'annual-taxes');
    const taxCommentary = getFieldValue(section, 'tax-commentary');

    return `
    <div class="section">
      <h2 class="section-title">Property Taxes & Assessment</h2>

      <!-- Property Taxes & Assessment Table -->
      <h3 class="subsection-title">Assessment & Tax Summary</h3>
      <table class="site-table">
        <tbody>
          <tr>
            <td class="site-table-label">Assessment Year</td>
            <td class="site-table-value">${assessmentYear || '<span class="empty-state">—</span>'}</td>
          </tr>
          <tr>
            <td class="site-table-label">Land Assessment</td>
            <td class="site-table-value">${landAssessment ? formatCurrency(landAssessment) : '<span class="empty-state">—</span>'}</td>
          </tr>
          <tr>
            <td class="site-table-label">Building Assessment</td>
            <td class="site-table-value">${buildingAssessment ? formatCurrency(buildingAssessment) : '<span class="empty-state">—</span>'}</td>
          </tr>
          <tr>
            <td class="site-table-label">Total Assessment</td>
            <td class="site-table-value">${totalAssessment ? formatCurrency(totalAssessment) : '<span class="empty-state">—</span>'}</td>
          </tr>
          <tr>
            <td class="site-table-label">Mill Rate</td>
            <td class="site-table-value">${millRate || '<span class="empty-state">—</span>'}</td>
          </tr>
          <tr>
            <td class="site-table-label">Annual Taxes</td>
            <td class="site-table-value">${annualTaxes ? formatCurrency(annualTaxes) : '<span class="empty-state">—</span>'}</td>
          </tr>
        </tbody>
      </table>

      <!-- Tax Commentary Narrative -->
      ${taxCommentary ? `
        <h3 class="subsection-title" style="margin-top: 1.5rem;">Tax Commentary</h3>
        <p class="site-narrative-text">${taxCommentary}</p>
      ` : ''}
    </div>
    `;
  };

  // Helper function to render the ZONE section with EXPANDED custom template (2-3 pages)
  const renderZoneSection = (section: ReportSection): string => {
    // Get field values from subsections
    const zoningClassification = getFieldValue(section, 'zoning-classification');
    const zoningDescription = getFieldValue(section, 'zoning-description');
    const permittedUses = getFieldValue(section, 'permitted-uses');
    const conditionalUses = getFieldValue(section, 'zone-conditional-uses');
    const maxHeight = getFieldValue(section, 'max-height');
    const maxDensity = getFieldValue(section, 'max-density');
    const minSetback = getFieldValue(section, 'zone-setbacks');
    const minLotSize = getFieldValue(section, 'zone-minimum-lot-size');
    const parkingRequirements = getFieldValue(section, 'parking-requirements');
    const zoningConformance = getFieldValue(section, 'zoning-conformance');
    const zoningConclusion = getFieldValue(section, 'zoning-conclusion');
    const zoningMap = getFieldValue(section, 'zoning-map');

    // Parse permitted uses if it's a comma-separated string or array
    let permittedUsesList: string[] = [];
    if (permittedUses) {
      if (typeof permittedUses === 'string') {
        permittedUsesList = permittedUses.split(',').map(use => use.trim()).filter(use => use);
      } else if (Array.isArray(permittedUses)) {
        permittedUsesList = permittedUses;
      }
    }

    // Parse conditional uses
    let conditionalUsesList: string[] = [];
    if (conditionalUses) {
      if (typeof conditionalUses === 'string') {
        conditionalUsesList = conditionalUses.split(',').map(use => use.trim()).filter(use => use);
      } else if (Array.isArray(conditionalUses)) {
        conditionalUsesList = conditionalUses;
      }
    }

    // Check if we have zoning map images
    let zoningMapUrls: string[] = [];
    if (zoningMap) {
      if (typeof zoningMap === 'string') {
        zoningMapUrls = [zoningMap];
      } else if (Array.isArray(zoningMap)) {
        zoningMapUrls = zoningMap;
      }
    }

    const hasDevelopmentStandards = maxHeight || maxDensity || minSetback || minLotSize || parkingRequirements;

    return `
    <div class="section">
      <h2 class="section-title">Land Use & Planning</h2>

      <!-- 1. LAND USE OVERVIEW (0.5 page) -->
      ${zoningDescription || zoningClassification ? `
        <h3 class="subsection-title">Land Use Overview</h3>
        ${zoningClassification ? `
          <p class="site-narrative-text" style="margin-bottom: 1rem;">
            <strong>Zoning Designation:</strong> ${zoningClassification}
          </p>
        ` : ''}
        ${zoningDescription ? `
          <p class="site-narrative-text" style="line-height: 1.8;">
            ${zoningDescription}
          </p>
        ` : ''}
        <div style="page-break-after: avoid; margin-bottom: 2rem;"></div>
      ` : ''}

      <!-- 2. ZONING CLASSIFICATION TABLE (0.5 page) -->
      ${zoningClassification || permittedUsesList.length > 0 || zoningDescription ? `
        <h3 class="subsection-title" style="margin-top: 2rem;">Zoning Classification</h3>
        <p class="site-narrative-text" style="margin-bottom: 1rem;">
          The following table summarizes the zoning designation and permitted uses for the subject property:
        </p>

        <table class="site-table" style="margin-top: 1rem; margin-bottom: 2rem;">
          <thead>
            <tr style="background-color: #f3f4f6;">
              <th style="padding: 0.75rem; text-align: left; font-weight: 600; border-bottom: 2px solid #e5e7eb;">Classification</th>
              <th style="padding: 0.75rem; text-align: left; font-weight: 600; border-bottom: 2px solid #e5e7eb;">Details</th>
            </tr>
          </thead>
          <tbody>
            ${zoningClassification ? `
              <tr>
                <td class="site-table-label" style="vertical-align: top; width: 35%;">Current Zoning</td>
                <td class="site-table-value">${zoningClassification}</td>
              </tr>
            ` : ''}
            ${zoningDescription ? `
              <tr>
                <td class="site-table-label" style="vertical-align: top;">Zoning Description</td>
                <td class="site-table-value">${zoningDescription}</td>
              </tr>
            ` : ''}
            ${permittedUsesList.length > 0 ? `
              <tr>
                <td class="site-table-label" style="vertical-align: top;">Permitted Uses</td>
                <td class="site-table-value">
                  <ul style="margin: 0; padding-left: 1.5rem; line-height: 1.8;">
                    ${permittedUsesList.map(use => `<li>${use}</li>`).join('')}
                  </ul>
                </td>
              </tr>
            ` : permittedUses ? `
              <tr>
                <td class="site-table-label" style="vertical-align: top;">Permitted Uses</td>
                <td class="site-table-value">${permittedUses}</td>
              </tr>
            ` : ''}
            ${conditionalUsesList.length > 0 ? `
              <tr>
                <td class="site-table-label" style="vertical-align: top;">Conditional Uses</td>
                <td class="site-table-value">
                  <ul style="margin: 0; padding-left: 1.5rem; line-height: 1.8;">
                    ${conditionalUsesList.map(use => `<li>${use}</li>`).join('')}
                  </ul>
                </td>
              </tr>
            ` : conditionalUses ? `
              <tr>
                <td class="site-table-label" style="vertical-align: top;">Conditional Uses</td>
                <td class="site-table-value">${conditionalUses}</td>
              </tr>
            ` : ''}
          </tbody>
        </table>
      ` : ''}

      <!-- PAGE BREAK AFTER CLASSIFICATION TABLE -->
      <div style="page-break-before: auto; margin-top: 2rem;"></div>

      <!-- 3. ZONING COMPLIANCE ANALYSIS (0.5 page) -->
      ${hasDevelopmentStandards || zoningConformance ? `
        <h3 class="subsection-title" style="margin-top: 2rem;">Zoning Compliance Analysis</h3>

        ${zoningConformance ? `
          <p class="site-narrative-text" style="margin-bottom: 1.5rem;">
            <strong>Conformance Status:</strong> ${zoningConformance}
          </p>
        ` : ''}

        ${hasDevelopmentStandards ? `
          <p class="site-narrative-text" style="margin-bottom: 1rem;">
            The subject property's compliance with zoning requirements is analyzed below:
          </p>

          <table class="site-table" style="margin-top: 1rem; margin-bottom: 2rem;">
            <thead>
              <tr style="background-color: #f3f4f6;">
                <th style="padding: 0.75rem; text-align: left; font-weight: 600; border-bottom: 2px solid #e5e7eb; width: 40%;">Zoning Requirement</th>
                <th style="padding: 0.75rem; text-align: left; font-weight: 600; border-bottom: 2px solid #e5e7eb;">Standard</th>
              </tr>
            </thead>
            <tbody>
              ${minLotSize ? `
                <tr>
                  <td class="site-table-label">Minimum Lot Size</td>
                  <td class="site-table-value">${minLotSize}</td>
                </tr>
              ` : ''}
              ${minSetback ? `
                <tr>
                  <td class="site-table-label">Setback Requirements</td>
                  <td class="site-table-value">${minSetback}</td>
                </tr>
              ` : ''}
              ${maxHeight ? `
                <tr>
                  <td class="site-table-label">Maximum Height</td>
                  <td class="site-table-value">${maxHeight}</td>
                </tr>
              ` : ''}
              ${maxDensity ? `
                <tr>
                  <td class="site-table-label">Maximum Density</td>
                  <td class="site-table-value">${maxDensity}</td>
                </tr>
              ` : ''}
              ${parkingRequirements ? `
                <tr>
                  <td class="site-table-label">Parking Requirements</td>
                  <td class="site-table-value">${parkingRequirements}</td>
                </tr>
              ` : ''}
            </tbody>
          </table>
        ` : ''}

        <p class="site-narrative-text" style="line-height: 1.8; margin-bottom: 2rem;">
          ${zoningConformance === 'Legally Conforming' || zoningConformance?.toLowerCase().includes('conforming')
          ? 'Based on the analysis of the current zoning requirements, the subject property is in compliance with applicable development standards. The current use is a legally permitted use under the current zoning designation.'
          : zoningConformance
            ? `The subject property's conformance status is: ${zoningConformance}. Additional details regarding any non-conforming aspects are detailed in the zoning conclusion below.`
            : 'The subject property zoning compliance has been evaluated against the applicable municipal bylaws and development standards.'}
        </p>
      ` : ''}

      <!-- 4. FUTURE LAND USE (0.5 page) -->
      <h3 class="subsection-title" style="margin-top: 2rem;">Future Land Use</h3>
      <p class="site-narrative-text" style="line-height: 1.8; margin-bottom: 1rem;">
        The subject property's current zoning and permitted uses align with the municipality's long-term planning objectives. Based on review of available planning documents, no immediate zoning changes are anticipated for this area.
      </p>

      ${zoningClassification ? `
        <table class="site-table" style="margin-top: 1rem; margin-bottom: 2rem;">
          <tbody>
            <tr>
              <td class="site-table-label" style="width: 40%;">Official Community Plan Designation</td>
              <td class="site-table-value">${zoningClassification.includes('Residential') ? 'Residential' : zoningClassification.includes('Commercial') ? 'Commercial' : zoningClassification.includes('Industrial') ? 'Industrial' : 'Mixed Use'}</td>
            </tr>
            <tr>
              <td class="site-table-label">Future Development Potential</td>
              <td class="site-table-value">
                ${permittedUses || zoningDescription
          ? 'The property retains development potential consistent with its current zoning designation. Additional development or intensification would be subject to municipal approval and compliance with current bylaws.'
          : 'Development potential subject to municipal regulations and approval.'}
              </td>
            </tr>
            <tr>
              <td class="site-table-label">Anticipated Zoning Changes</td>
              <td class="site-table-value">No zoning change is believed to be imminent based on current municipal planning initiatives.</td>
            </tr>
          </tbody>
        </table>
      ` : `
        <p class="site-narrative-text" style="line-height: 1.8; margin-bottom: 2rem;">
          The property is anticipated to remain under its current zoning designation. Future development potential exists within the parameters of the existing zoning framework, subject to municipal approval processes and compliance with applicable regulations.
        </p>
      `}

      <!-- PAGE BREAK BEFORE CONCLUSION -->
      <div style="page-break-before: auto; margin-top: 2rem;"></div>

      <!-- 5. ZONING CONCLUSION (0.5 page) -->
      ${zoningConclusion ? `
        <h3 class="subsection-title" style="margin-top: 2rem;">Zoning Conclusion</h3>
        <p class="site-narrative-text" style="line-height: 1.8; margin-bottom: 2rem;">
          ${zoningConclusion}
        </p>
      ` : `
        <h3 class="subsection-title" style="margin-top: 2rem;">Zoning Conclusion</h3>
        <p class="site-narrative-text" style="line-height: 1.8; margin-bottom: 2rem;">
          Based on the foregoing analysis, the subject property appears to be a legally conforming use of the subject site under the current zoning designation. The property's existing improvements and use align with the permitted uses outlined in the applicable zoning bylaw. No significant zoning impediments or non-conforming aspects were identified that would adversely impact the property's marketability or highest and best use.
        </p>
      `}

      <!-- ZONING MAP (if available) -->
      ${zoningMapUrls.length > 0 ? `
        <h3 class="subsection-title" style="margin-top: 2rem;">Zoning Map</h3>
        <div style="margin-top: 1rem; margin-bottom: 2rem;">
          ${zoningMapUrls.map(url => `
            <div style="border: 1px solid #e5e7eb; border-radius: 4px; overflow: hidden; margin-bottom: 1rem;">
              <img src="${url}" alt="Zoning Map" style="width: 100%; height: auto; max-height: 600px; object-fit: contain;" />
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${!zoningClassification && !zoningDescription && !permittedUses && !hasDevelopmentStandards && !zoningConformance && !zoningConclusion ? `
        <div class="empty-state-block">[Provide zoning details]</div>
      ` : ''}
    </div>
    `;
  };

  // Helper function to render the HBU (Highest & Best Use) section with custom template
  const renderHbuSection = (section: ReportSection): string => {
    // Get field values
    const hbuIntroduction = getFieldValue(section, 'hbu-introduction') ||
      'The highest and best use of a property is defined as the reasonably probable and legal use of property that is physically possible, appropriately supported, and financially feasible, and that results in the highest value. The highest and best use analysis is conducted for the site as if vacant and for the property as improved.';

    // As Vacant Analysis
    const legallyPermissible = getFieldValue(section, 'legally-permissible');
    const physicallyPossible = getFieldValue(section, 'physically-possible');
    const financiallyFeasible = getFieldValue(section, 'financially-feasible');
    const maximallyProductive = getFieldValue(section, 'maximally-productive');
    const asVacantConclusion = getFieldValue(section, 'as-vacant-conclusion');

    // As Improved Analysis
    const asImprovedAnalysis = getFieldValue(section, 'as-improved-analysis');
    const asImprovedConclusion = getFieldValue(section, 'as-improved-conclusion');

    // Final HBU Conclusion
    const finalHbuConclusion = getFieldValue(section, 'final-hbu-conclusion');

    return `
    <div class="section">
      <h2 class="section-title">Highest & Best Use</h2>

      <!-- Introduction -->
      <div class="site-narrative-section">
        <p class="site-narrative-text">${hbuIntroduction}</p>
      </div>

      <!-- As Vacant Analysis -->
      <h3 class="subsection-title" style="margin-top: 1.5rem;">Analysis As Vacant</h3>

      ${legallyPermissible ? `
        <div class="site-narrative-section">
          <h4 class="site-narrative-label">Legally Permissible</h4>
          <p class="site-narrative-text">${legallyPermissible}</p>
        </div>
      ` : `
        <div class="site-narrative-section">
          <h4 class="site-narrative-label">Legally Permissible</h4>
          <div class="empty-state-block">[Provide details]</div>
        </div>
      `}

      ${physicallyPossible ? `
        <div class="site-narrative-section">
          <h4 class="site-narrative-label">Physically Possible</h4>
          <p class="site-narrative-text">${physicallyPossible}</p>
        </div>
      ` : `
        <div class="site-narrative-section">
          <h4 class="site-narrative-label">Physically Possible</h4>
          <div class="empty-state-block">[Provide details]</div>
        </div>
      `}

      ${financiallyFeasible ? `
        <div class="site-narrative-section">
          <h4 class="site-narrative-label">Financially Feasible</h4>
          <p class="site-narrative-text">${financiallyFeasible}</p>
        </div>
      ` : `
        <div class="site-narrative-section">
          <h4 class="site-narrative-label">Financially Feasible</h4>
          <div class="empty-state-block">[Provide details]</div>
        </div>
      `}

      ${maximallyProductive ? `
        <div class="site-narrative-section">
          <h4 class="site-narrative-label">Maximally Productive</h4>
          <p class="site-narrative-text">${maximallyProductive}</p>
        </div>
      ` : `
        <div class="site-narrative-section">
          <h4 class="site-narrative-label">Maximally Productive</h4>
          <div class="empty-state-block">[Provide details]</div>
        </div>
      `}

      ${asVacantConclusion ? `
        <div class="site-narrative-section">
          <h4 class="site-narrative-label">As Vacant Conclusion</h4>
          <p class="site-narrative-text" style="font-weight: bold;">${asVacantConclusion}</p>
        </div>
      ` : ''}

      <!-- As Improved Analysis -->
      <h3 class="subsection-title" style="margin-top: 1.5rem;">Analysis As Improved</h3>

      ${asImprovedAnalysis ? `
        <div class="site-narrative-section">
          <p class="site-narrative-text">${asImprovedAnalysis}</p>
        </div>
      ` : `
        <div class="empty-state-block">[Provide analysis]</div>
      `}

      ${asImprovedConclusion ? `
        <div class="site-narrative-section">
          <h4 class="site-narrative-label">As Improved Conclusion</h4>
          <p class="site-narrative-text" style="font-weight: bold;">${asImprovedConclusion}</p>
        </div>
      ` : ''}

      <!-- Final HBU Conclusion -->
      ${finalHbuConclusion ? `
        <h3 class="subsection-title" style="margin-top: 1.5rem;">Final Highest & Best Use Conclusion</h3>
        <div class="site-narrative-section">
          <p class="site-narrative-text" style="font-weight: bold; font-size: 13px;">${finalHbuConclusion}</p>
        </div>
      ` : ''}
    </div>
    `;
  };

  // Helper function to render the RECON (Reconciliation) section with custom template
  const renderReconSection = (section: ReportSection): string => {
    // Get field values
    const reconIntroduction = getFieldValue(section, 'recon-introduction');

    // Value Summary Table data
    const incomeApproachValue = getFieldValue(section, 'income-approach-value');
    const incomeApproachWeight = getFieldValue(section, 'income-approach-weight');
    const salesComparisonValue = getFieldValue(section, 'sales-comparison-value');
    const salesComparisonWeight = getFieldValue(section, 'sales-comparison-weight');
    const costApproachValue = getFieldValue(section, 'cost-approach-value');
    const costApproachWeight = getFieldValue(section, 'cost-approach-weight');

    // Reconciliation Analysis
    const reconAnalysis = getFieldValue(section, 'recon-analysis');

    // Final Value Conclusion Table data
    const finalValueScenario = getFieldValue(section, 'final-value-scenario') || valueScenario;
    const finalInterestAppraised = getFieldValue(section, 'final-interest-appraised') || propertyRights;
    const finalEffectiveDate = getFieldValue(section, 'final-effective-date') || valuationDate;
    const finalConcludedValue = getFieldValue(section, 'final-concluded-value') || concludedValue;

    return `
    <div class="section">
      <h2 class="section-title">Reconciliation of Value</h2>

      <!-- Introduction -->
      ${reconIntroduction ? `
        <div class="site-narrative-section">
          <p class="site-narrative-text">${reconIntroduction}</p>
        </div>
      ` : ''}

      <!-- Value Summary Table -->
      <h3 class="subsection-title" style="margin-top: 1.5rem;">Value Summary</h3>
      <table class="letter-value-table">
        <thead>
          <tr>
            <th>Approach</th>
            <th>Indicated Value</th>
            <th>Weight</th>
          </tr>
        </thead>
        <tbody>
          ${incomeApproachValue ? `
          <tr>
            <td>Income Approach</td>
            <td>${formatCurrency(incomeApproachValue)}</td>
            <td>${incomeApproachWeight || '<span class="empty-state">—</span>'}</td>
          </tr>
          ` : ''}
          ${salesComparisonValue ? `
          <tr>
            <td>Sales Comparison Approach</td>
            <td>${formatCurrency(salesComparisonValue)}</td>
            <td>${salesComparisonWeight || '<span class="empty-state">—</span>'}</td>
          </tr>
          ` : ''}
          ${costApproachValue ? `
          <tr>
            <td>Cost Approach</td>
            <td>${formatCurrency(costApproachValue)}</td>
            <td>${costApproachWeight || '<span class="empty-state">—</span>'}</td>
          </tr>
          ` : ''}
          ${!incomeApproachValue && !salesComparisonValue && !costApproachValue ? `
          <tr>
            <td colspan="3" style="text-align: center;">
              <span class="empty-state">No approach values specified</span>
            </td>
          </tr>
          ` : ''}
        </tbody>
      </table>

      <!-- Reconciliation Analysis -->
      <h3 class="subsection-title" style="margin-top: 1.5rem;">Reconciliation Analysis</h3>
      ${reconAnalysis ? `
        <div class="site-narrative-section">
          <p class="site-narrative-text">${reconAnalysis}</p>
        </div>
      ` : `
        <div class="empty-state-block">[Provide reconciliation analysis]</div>
      `}

      <!-- Final Value Conclusion -->
      <h3 class="subsection-title" style="margin-top: 1.5rem;">Final Value Conclusion</h3>
      <table class="letter-value-table">
        <thead>
          <tr>
            <th>Value Scenario</th>
            <th>Interest Appraised</th>
            <th>Effective Date</th>
            <th>Concluded Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${finalValueScenario || '<span class="empty-state">—</span>'}</td>
            <td>${finalInterestAppraised || '<span class="empty-state">—</span>'}</td>
            <td>${finalEffectiveDate || '<span class="empty-state">—</span>'}</td>
            <td><strong>${finalConcludedValue ? formatCurrency(finalConcludedValue) : '<span class="empty-state">—</span>'}</strong></td>
          </tr>
        </tbody>
      </table>
    </div>
    `;
  };


  // Helper function to render the INCOME section with custom template
  // EXPANDED renderIncomeSection function - 14 pages
  // This is the replacement for lines 751-948 in reportHtmlTemplate.ts

  const renderIncomeSection = (section: ReportSection): string => {
    // Get Pro Forma Operating Statement values
    const potentialGrossIncome = getFieldValue(section, 'potential-gross-income');
    const vacancyAmount = getFieldValue(section, 'vacancy-amount');
    const vacancyPercent = getFieldValue(section, 'vacancy-percent');
    const otherIncome = getFieldValue(section, 'other-income');
    const effectiveGrossIncome = getFieldValue(section, 'effective-gross-income');

    // Operating expenses
    const managementFee = getFieldValue(section, 'management-fee');
    const managementPercent = getFieldValue(section, 'management-percent');
    const insurance = getFieldValue(section, 'insurance');
    const insurancePercent = getFieldValue(section, 'insurance-percent');
    const propertyTaxes = getFieldValue(section, 'property-taxes');
    const propertyTaxesPercent = getFieldValue(section, 'property-taxes-percent');
    const utilities = getFieldValue(section, 'utilities');
    const utilitiesPercent = getFieldValue(section, 'utilities-percent');
    const repairs = getFieldValue(section, 'repairs-maintenance');
    const repairsPercent = getFieldValue(section, 'repairs-maintenance-percent');
    const landscaping = getFieldValue(section, 'landscaping');
    const landscapingPercent = getFieldValue(section, 'landscaping-percent');
    const advertising = getFieldValue(section, 'advertising');
    const advertisingPercent = getFieldValue(section, 'advertising-percent');
    const legalAccounting = getFieldValue(section, 'legal-accounting');
    const legalAccountingPercent = getFieldValue(section, 'legal-accounting-percent');
    const miscExpenses = getFieldValue(section, 'misc-expenses');
    const miscExpensesPercent = getFieldValue(section, 'misc-expenses-percent');
    const totalExpenses = getFieldValue(section, 'total-expenses');
    const totalExpensesPercent = getFieldValue(section, 'total-expenses-percent');

    // Net Operating Income
    const netOperatingIncome = getFieldValue(section, 'net-operating-income');
    const noiPercent = getFieldValue(section, 'noi-percent');

    // Capitalization Rate Analysis
    const capRateAnalysis = getFieldValue(section, 'cap-rate-analysis');

    // Direct Capitalization Values
    const noi = getFieldValue(section, 'noi-value');
    const capRate = getFieldValue(section, 'cap-rate');
    const indicatedValue = getFieldValue(section, 'indicated-value');

    // Additional field values for expanded sections (from calc-* and income-* fields)
    const incomeApproachMethodology = getFieldValue(section, 'income-approach-methodology') ||
      `The Income Approach is based on the premise that properties are purchased for their income producing potential. It considers both the annual return on the invested capital and the return of the invested capital. The two fundamental methods of this valuation technique include Discounted Cash Flow and Direct Capitalization. The Direct Capitalization method of the Income Approach is used in this analysis. This valuation technique best represents the decision-making process of an investor.`;

    const directCapMethodology = getFieldValue(section, 'direct-cap-methodology') ||
      `The first step in direct capitalization is to estimate the durable rental income through analysis of the in-place or projected (proposed developments) leases and market rent terms. Next, reimbursements and other revenue are analyzed. Then, vacancy and operating expenses are estimated. Finally, the net operating income is capitalized at a supported rate. The implied value may be adjusted to account for non-stabilized conditions or required capital expenditures to reflect an as-is value.`;

    // Rental Analysis fields
    const marketRentSurvey = getFieldValue(section, 'income-market-rent-survey') || '';
    const rentComparables = getFieldValue(section, 'income-rent-comparables') || '';
    const rentConclusion = getFieldValue(section, 'income-rent-conclusion') || '';

    // Unit Mix & Rental Income
    const unitMixTable = getFieldValue(section, 'income-unit-mix') || '';
    const rentalIncomeAnalysis = getFieldValue(section, 'income-rental-analysis') || '';

    // Vacancy & Collection Loss
    const vacancyAnalysis = getFieldValue(section, 'income-vacancy-analysis') ||
      `Market participants typically expect a vacancy of 2% to 5% of potential gross income for similar property types. This assignment reflects the probable vacancy during the economic life of the property and not necessarily the current or short-term vacancy. Based on current and perceived long-term market conditions and the subject's anticipated tenancy over a typical holding period, a vacancy allowance of ${vacancyPercent || '3.8'}% is concluded.`;

    const marketVacancyData = getFieldValue(section, 'income-market-vacancy') || '';

    // EGI Analysis
    const egiSummary = getFieldValue(section, 'income-egi-summary') || '';

    // Operating Expenses - Detailed narratives
    const managementNarrative = getFieldValue(section, 'income-management-narrative') ||
      `Management fees typically range from 3% to 5% of effective gross income for multifamily properties. This reflects the cost of professional property management, including tenant relations, rent collection, maintenance coordination, and financial reporting. Based on market standards and the property's operational complexity, a management fee of ${managementPercent || '4.0'}% of EGI is applied.`;

    const propertyTaxNarrative = getFieldValue(section, 'income-property-tax-narrative') || '';
    const insuranceNarrative = getFieldValue(section, 'income-insurance-narrative') ||
      `Insurance costs for multifamily properties include property insurance, liability coverage, and loss of rents coverage. Based on market surveys and the property's characteristics, annual insurance expense is estimated at ${insurance ? formatCurrency(insurance) : 'market rates'}.`;

    const repairsNarrative = getFieldValue(section, 'income-repairs-narrative') ||
      `Repairs and maintenance includes routine upkeep, unit turns, common area maintenance, and preventative maintenance programs. Industry standards suggest 8-12% of EGI for aging properties, with adjustments based on property condition and age.`;

    const utilitiesNarrative = getFieldValue(section, 'income-utilities-narrative') || '';
    const payrollNarrative = getFieldValue(section, 'income-payroll-narrative') || '';
    const otherExpensesNarrative = getFieldValue(section, 'income-other-expenses') || '';
    const reservesNarrative = getFieldValue(section, 'income-reserves-narrative') ||
      `Reserves for replacement account for the periodic replacement of building systems and components such as roofs, HVAC systems, parking surfaces, and appliances. Industry standards suggest $250-$400 per unit annually, adjusted for property age and condition.`;

    // NOI Analysis
    const noiSummary = getFieldValue(section, 'income-noi-summary') || '';

    // Cap Rate fields
    const alternativeInvestmentRates = getFieldValue(section, 'income-alternative-investments') ||
      `The capitalization rate selected to value the subject property is expected to be higher than the current yield of approximately 3.2% on 10-year Government of Canada bonds. A risk premium of 75-300 basis points is typically applied to commercial and multifamily real estate, resulting in an implied capitalization rate in the range of 4.25%-6.25%. This spread reflects the illiquidity of real estate, management burden and overall (leasing, micro and macro market, physical, financing and regulatory) risk associated with real estate ownership compared to the risk free rate of government securities.`;

    const investmentTrends = getFieldValue(section, 'income-investment-trends') || '';
    const capRateSurvey = getFieldValue(section, 'income-cap-rate-survey') || '';
    const bandOfInvestment = getFieldValue(section, 'income-band-investment') || '';
    const capRateConclusion = getFieldValue(section, 'income-cap-rate-conclusion') || '';

    // Final conclusion
    const incomeApproachConclusion = getFieldValue(section, 'income-approach-conclusion') ||
      `Given that the subject is a multitenant asset with short term leases, it is generally understood that the direct capitalization method is preferred, making the discounted cash flow (DCF) method less meaningful. For this reason, we have completed only the direct capitalization method.`;

    return `
    <div class="section">
      <h2 class="section-title">Income Capitalization Approach</h2>

      <!-- PAGE 1: Income Approach Methodology -->
      <h3 class="subsection-title">Income Approach Methodology</h3>
      <div class="site-narrative-section">
        <p class="site-narrative-text">${incomeApproachMethodology}</p>
      </div>

      <h4 class="site-narrative-label" style="margin-top: 1rem;">Direct Capitalization Method</h4>
      <div class="site-narrative-section">
        <p class="site-narrative-text">${directCapMethodology}</p>
      </div>

      <!-- PAGE BREAK -->
      <div style="page-break-before: always;"></div>

      <!-- PAGES 2-3: Rental Analysis -->
      <h3 class="subsection-title">Multi-Family Market Rent Survey Analysis</h3>
      <div class="site-narrative-section">
        <p class="site-narrative-text">${marketRentSurvey || 'This section examines comparable properties within the marketplace to estimate market rent for the subject. This allows for a comparison of the subject property\'s contract rent to what is attainable in the current market.'}</p>
      </div>

      ${rentComparables ? `
        <h4 class="site-narrative-label" style="margin-top: 1rem;">Rental Comparables</h4>
        <div class="site-narrative-section">
          <p class="site-narrative-text">${rentComparables}</p>
        </div>
      ` : ''}

      <h4 class="site-narrative-label" style="margin-top: 1rem;">Conclusion of Market Rent</h4>
      <div class="site-narrative-section">
        <p class="site-narrative-text">${rentConclusion || 'Market rents have been concluded based on analysis of comparable properties, adjusted for differences in location, quality, condition, and amenities.'}</p>
      </div>

      <!-- PAGE BREAK -->
      <div style="page-break-before: always;"></div>

      <!-- PAGE 4: Unit Mix & Rental Income -->
      <h3 class="subsection-title">Unit Mix & Rental Income</h3>

      ${unitMixTable ? `
        <div class="site-narrative-section">
          ${unitMixTable}
        </div>
      ` : `
        <p class="site-narrative-text">The following table summarizes the subject's in-place unit mix and rental rates.</p>
      `}

      ${rentalIncomeAnalysis ? `
        <div class="site-narrative-section" style="margin-top: 1rem;">
          <p class="site-narrative-text">${rentalIncomeAnalysis}</p>
        </div>
      ` : ''}

      <h4 class="site-narrative-label" style="margin-top: 1rem;">Total Rental Revenue</h4>
      <table class="site-table">
        <tbody>
          <tr>
            <td class="site-table-label">Potential Gross Income</td>
            <td class="site-table-value">${potentialGrossIncome ? formatCurrency(potentialGrossIncome) : '<span class="empty-state">-</span>'}</td>
          </tr>
          ${otherIncome ? `
          <tr>
            <td class="site-table-label">Other Income</td>
            <td class="site-table-value">${formatCurrency(otherIncome)}</td>
          </tr>
          ` : ''}
        </tbody>
      </table>

      <!-- PAGE BREAK -->
      <div style="page-break-before: always;"></div>

      <!-- PAGE 5: Vacancy & Collection Loss -->
      <h3 class="subsection-title">Vacancy & Collection Loss</h3>

      <div class="site-narrative-section">
        <p class="site-narrative-text">${vacancyAnalysis}</p>
      </div>

      ${marketVacancyData ? `
        <h4 class="site-narrative-label" style="margin-top: 1rem;">Market Vacancy Data</h4>
        <div class="site-narrative-section">
          <p class="site-narrative-text">${marketVacancyData}</p>
        </div>
      ` : ''}

      <table class="site-table" style="margin-top: 1rem;">
        <tbody>
          <tr>
            <td class="site-table-label">Vacancy Allowance</td>
            <td class="site-table-value">${vacancyPercent ? formatPercent(vacancyPercent) : '<span class="empty-state">-</span>'}</td>
          </tr>
          <tr>
            <td class="site-table-label">Vacancy Amount</td>
            <td class="site-table-value">${vacancyAmount ? '(' + formatCurrency(vacancyAmount) + ')' : '<span class="empty-state">-</span>'}</td>
          </tr>
        </tbody>
      </table>

      <!-- PAGE 6: Effective Gross Income -->
      <h3 class="subsection-title" style="margin-top: 1.5rem;">Effective Gross Income</h3>

      ${egiSummary ? `
        <div class="site-narrative-section">
          <p class="site-narrative-text">${egiSummary}</p>
        </div>
      ` : `
        <div class="site-narrative-section">
          <p class="site-narrative-text">Effective gross revenue equals the potential gross revenue less vacancy and collection loss. This represents the anticipated collectible income from the property under stabilized occupancy conditions.</p>
        </div>
      `}

      <table class="site-table" style="margin-top: 1rem;">
        <tbody>
          <tr>
            <td class="site-table-label">Potential Gross Income</td>
            <td class="site-table-value">${potentialGrossIncome ? formatCurrency(potentialGrossIncome) : '<span class="empty-state">-</span>'}</td>
          </tr>
          <tr>
            <td class="site-table-label">Less: Vacancy & Collection Loss</td>
            <td class="site-table-value">${vacancyAmount ? '(' + formatCurrency(vacancyAmount) + ')' : '<span class="empty-state">-</span>'}</td>
          </tr>
          ${otherIncome ? `
          <tr>
            <td class="site-table-label">Add: Other Income</td>
            <td class="site-table-value">${formatCurrency(otherIncome)}</td>
          </tr>
          ` : ''}
          <tr style="background: #f3f4f6; font-weight: bold;">
            <td class="site-table-label"><strong>Effective Gross Income</strong></td>
            <td class="site-table-value"><strong>${effectiveGrossIncome ? formatCurrency(effectiveGrossIncome) : '<span class="empty-state">-</span>'}</strong></td>
          </tr>
        </tbody>
      </table>

      <!-- PAGE BREAK -->
      <div style="page-break-before: always;"></div>

      <!-- PAGES 7-9: Operating Expenses (3 pages) -->
      <h3 class="subsection-title">Operating Expenses</h3>

      <div class="site-narrative-section">
        <p class="site-narrative-text">Operating expenses represent the periodic expenditures necessary to maintain the property and continue production of effective gross income. The following analysis considers historical operating expenses, market benchmarks, and property-specific factors.</p>
      </div>

      <!-- Management -->
      <h4 class="site-narrative-label" style="margin-top: 1.5rem;">Management</h4>
      <div class="site-narrative-section">
        <p class="site-narrative-text">${managementNarrative}</p>
      </div>
      <table class="site-table" style="margin-top: 0.5rem;">
        <tbody>
          <tr>
            <td class="site-table-label">Management Fee</td>
            <td class="site-table-value">${managementFee ? formatCurrency(managementFee) : '<span class="empty-state">-</span>'}</td>
          </tr>
          <tr>
            <td class="site-table-label">% of EGI</td>
            <td class="site-table-value">${managementPercent ? formatPercent(managementPercent) : '<span class="empty-state">-</span>'}</td>
          </tr>
        </tbody>
      </table>

      <!-- Property Taxes -->
      <h4 class="site-narrative-label" style="margin-top: 1.5rem;">Property Taxes</h4>
      <div class="site-narrative-section">
        <p class="site-narrative-text">${propertyTaxNarrative || 'Property taxes are based on the current municipal assessment and applicable mill rates. This represents a stabilized tax burden for the property.'}</p>
      </div>
      <table class="site-table" style="margin-top: 0.5rem;">
        <tbody>
          <tr>
            <td class="site-table-label">Annual Property Taxes</td>
            <td class="site-table-value">${propertyTaxes ? formatCurrency(propertyTaxes) : '<span class="empty-state">-</span>'}</td>
          </tr>
          <tr>
            <td class="site-table-label">% of EGI</td>
            <td class="site-table-value">${propertyTaxesPercent ? formatPercent(propertyTaxesPercent) : '<span class="empty-state">-</span>'}</td>
          </tr>
        </tbody>
      </table>

      <!-- PAGE BREAK -->
      <div style="page-break-before: always;"></div>

      <!-- Insurance -->
      <h4 class="site-narrative-label">Insurance</h4>
      <div class="site-narrative-section">
        <p class="site-narrative-text">${insuranceNarrative}</p>
      </div>
      <table class="site-table" style="margin-top: 0.5rem;">
        <tbody>
          <tr>
            <td class="site-table-label">Annual Insurance</td>
            <td class="site-table-value">${insurance ? formatCurrency(insurance) : '<span class="empty-state">-</span>'}</td>
          </tr>
          <tr>
            <td class="site-table-label">% of EGI</td>
            <td class="site-table-value">${insurancePercent ? formatPercent(insurancePercent) : '<span class="empty-state">-</span>'}</td>
          </tr>
        </tbody>
      </table>

      <!-- Repairs & Maintenance -->
      <h4 class="site-narrative-label" style="margin-top: 1.5rem;">Repairs & Maintenance</h4>
      <div class="site-narrative-section">
        <p class="site-narrative-text">${repairsNarrative}</p>
      </div>
      <table class="site-table" style="margin-top: 0.5rem;">
        <tbody>
          <tr>
            <td class="site-table-label">Repairs & Maintenance</td>
            <td class="site-table-value">${repairs ? formatCurrency(repairs) : '<span class="empty-state">-</span>'}</td>
          </tr>
          <tr>
            <td class="site-table-label">% of EGI</td>
            <td class="site-table-value">${repairsPercent ? formatPercent(repairsPercent) : '<span class="empty-state">-</span>'}</td>
          </tr>
        </tbody>
      </table>

      ${utilities ? `
      <!-- Utilities -->
      <h4 class="site-narrative-label" style="margin-top: 1.5rem;">Utilities</h4>
      <div class="site-narrative-section">
        <p class="site-narrative-text">${utilitiesNarrative || 'Utilities include landlord-paid expenses for common areas and tenant-occupied spaces, including electricity, gas, water, and sewer services.'}</p>
      </div>
      <table class="site-table" style="margin-top: 0.5rem;">
        <tbody>
          <tr>
            <td class="site-table-label">Utilities</td>
            <td class="site-table-value">${formatCurrency(utilities)}</td>
          </tr>
          <tr>
            <td class="site-table-label">% of EGI</td>
            <td class="site-table-value">${utilitiesPercent ? formatPercent(utilitiesPercent) : '<span class="empty-state">-</span>'}</td>
          </tr>
        </tbody>
      </table>
      ` : ''}

      <!-- PAGE BREAK -->
      <div style="page-break-before: always;"></div>

      ${landscaping ? `
      <!-- Landscaping -->
      <h4 class="site-narrative-label">Landscaping & Grounds Maintenance</h4>
      <div class="site-narrative-section">
        <p class="site-narrative-text">Landscaping expenses include grounds maintenance, snow removal, and seasonal landscaping services to maintain curb appeal and tenant satisfaction.</p>
      </div>
      <table class="site-table" style="margin-top: 0.5rem;">
        <tbody>
          <tr>
            <td class="site-table-label">Landscaping</td>
            <td class="site-table-value">${formatCurrency(landscaping)}</td>
          </tr>
          <tr>
            <td class="site-table-label">% of EGI</td>
            <td class="site-table-value">${landscapingPercent ? formatPercent(landscapingPercent) : '<span class="empty-state">-</span>'}</td>
          </tr>
        </tbody>
      </table>
      ` : ''}

      ${payrollNarrative ? `
      <!-- Payroll / On-site Management -->
      <h4 class="site-narrative-label" style="margin-top: 1.5rem;">Payroll / On-site Management</h4>
      <div class="site-narrative-section">
        <p class="site-narrative-text">${payrollNarrative}</p>
      </div>
      ` : ''}

      ${otherExpensesNarrative ? `
      <!-- Other Expenses -->
      <h4 class="site-narrative-label" style="margin-top: 1.5rem;">Other Operating Expenses</h4>
      <div class="site-narrative-section">
        <p class="site-narrative-text">${otherExpensesNarrative}</p>
      </div>
      ` : ''}

      <!-- Reserves for Replacement -->
      <h4 class="site-narrative-label" style="margin-top: 1.5rem;">Reserves for Replacement</h4>
      <div class="site-narrative-section">
        <p class="site-narrative-text">${reservesNarrative}</p>
      </div>

      ${advertising || legalAccounting || miscExpenses ? `
      <table class="site-table" style="margin-top: 1.5rem;">
        <thead>
          <tr>
            <th class="site-table-label" style="background: #1a365d; color: white;">Expense Category</th>
            <th class="site-table-value" style="background: #1a365d; color: white;">Amount</th>
            <th class="site-table-value" style="background: #1a365d; color: white;">% of EGI</th>
          </tr>
        </thead>
        <tbody>
          ${advertising ? `
          <tr>
            <td class="site-table-label">Advertising</td>
            <td class="site-table-value">${formatCurrency(advertising)}</td>
            <td class="site-table-value">${advertisingPercent ? formatPercent(advertisingPercent) : '-'}</td>
          </tr>
          ` : ''}
          ${legalAccounting ? `
          <tr>
            <td class="site-table-label">Legal & Accounting</td>
            <td class="site-table-value">${formatCurrency(legalAccounting)}</td>
            <td class="site-table-value">${legalAccountingPercent ? formatPercent(legalAccountingPercent) : '-'}</td>
          </tr>
          ` : ''}
          ${miscExpenses ? `
          <tr>
            <td class="site-table-label">Miscellaneous</td>
            <td class="site-table-value">${formatCurrency(miscExpenses)}</td>
            <td class="site-table-value">${miscExpensesPercent ? formatPercent(miscExpensesPercent) : '-'}</td>
          </tr>
          ` : ''}
        </tbody>
      </table>
      ` : ''}

      <!-- PAGE BREAK -->
      <div style="page-break-before: always;"></div>

      <!-- PAGE 10: Net Operating Income (0.5 page) -->
      <h3 class="subsection-title">Net Operating Income Summary</h3>

      ${noiSummary ? `
        <div class="site-narrative-section">
          <p class="site-narrative-text">${noiSummary}</p>
        </div>
      ` : `
        <div class="site-narrative-section">
          <p class="site-narrative-text">The net operating income equals the effective gross income less the total operating expenses. This represents the annual income available for debt service and return on investment.</p>
        </div>
      `}

      <!-- Complete Pro Forma Operating Statement -->
      <h4 class="site-narrative-label" style="margin-top: 1rem;">Pro Forma Operating Statement</h4>
      <table class="income-table">
        <thead>
          <tr>
            <th class="income-table-label">Line Item</th>
            <th class="income-table-amount">Amount</th>
            <th class="income-table-percent">% of EGI</th>
          </tr>
        </thead>
        <tbody>
          <tr class="income-section-header">
            <td colspan="3"><strong>REVENUE</strong></td>
          </tr>
          <tr>
            <td class="income-table-label">Potential Gross Income</td>
            <td class="income-table-amount">${potentialGrossIncome ? formatCurrency(potentialGrossIncome) : '<span class="empty-state">-</span>'}</td>
            <td class="income-table-percent"></td>
          </tr>
          <tr>
            <td class="income-table-label">Less: Vacancy</td>
            <td class="income-table-amount">${vacancyAmount ? '(' + formatCurrency(vacancyAmount) + ')' : '<span class="empty-state">-</span>'}</td>
            <td class="income-table-percent">${vacancyPercent ? formatPercent(vacancyPercent) : ''}</td>
          </tr>
          <tr>
            <td class="income-table-label">Add: Other Income</td>
            <td class="income-table-amount">${otherIncome ? formatCurrency(otherIncome) : '<span class="empty-state">-</span>'}</td>
            <td class="income-table-percent"></td>
          </tr>
          <tr class="income-subtotal">
            <td class="income-table-label"><strong>Effective Gross Income</strong></td>
            <td class="income-table-amount"><strong>${effectiveGrossIncome ? formatCurrency(effectiveGrossIncome) : '<span class="empty-state">-</span>'}</strong></td>
            <td class="income-table-percent"><strong>100%</strong></td>
          </tr>
          <tr class="income-spacer">
            <td colspan="3"></td>
          </tr>
          <tr class="income-section-header">
            <td colspan="3"><strong>OPERATING EXPENSES</strong></td>
          </tr>
          <tr>
            <td class="income-table-label">Management</td>
            <td class="income-table-amount">${managementFee ? formatCurrency(managementFee) : '<span class="empty-state">-</span>'}</td>
            <td class="income-table-percent">${managementPercent ? formatPercent(managementPercent) : ''}</td>
          </tr>
          <tr>
            <td class="income-table-label">Insurance</td>
            <td class="income-table-amount">${insurance ? formatCurrency(insurance) : '<span class="empty-state">-</span>'}</td>
            <td class="income-table-percent">${insurancePercent ? formatPercent(insurancePercent) : ''}</td>
          </tr>
          <tr>
            <td class="income-table-label">Property Taxes</td>
            <td class="income-table-amount">${propertyTaxes ? formatCurrency(propertyTaxes) : '<span class="empty-state">-</span>'}</td>
            <td class="income-table-percent">${propertyTaxesPercent ? formatPercent(propertyTaxesPercent) : ''}</td>
          </tr>
          ${utilities ? `
          <tr>
            <td class="income-table-label">Utilities</td>
            <td class="income-table-amount">${formatCurrency(utilities)}</td>
            <td class="income-table-percent">${utilitiesPercent ? formatPercent(utilitiesPercent) : ''}</td>
          </tr>
          ` : ''}
          ${repairs ? `
          <tr>
            <td class="income-table-label">Repairs & Maintenance</td>
            <td class="income-table-amount">${formatCurrency(repairs)}</td>
            <td class="income-table-percent">${repairsPercent ? formatPercent(repairsPercent) : ''}</td>
          </tr>
          ` : ''}
          ${landscaping ? `
          <tr>
            <td class="income-table-label">Landscaping</td>
            <td class="income-table-amount">${formatCurrency(landscaping)}</td>
            <td class="income-table-percent">${landscapingPercent ? formatPercent(landscapingPercent) : ''}</td>
          </tr>
          ` : ''}
          ${advertising ? `
          <tr>
            <td class="income-table-label">Advertising</td>
            <td class="income-table-amount">${formatCurrency(advertising)}</td>
            <td class="income-table-percent">${advertisingPercent ? formatPercent(advertisingPercent) : ''}</td>
          </tr>
          ` : ''}
          ${legalAccounting ? `
          <tr>
            <td class="income-table-label">Legal & Accounting</td>
            <td class="income-table-amount">${formatCurrency(legalAccounting)}</td>
            <td class="income-table-percent">${legalAccountingPercent ? formatPercent(legalAccountingPercent) : ''}</td>
          </tr>
          ` : ''}
          ${miscExpenses ? `
          <tr>
            <td class="income-table-label">Miscellaneous</td>
            <td class="income-table-amount">${formatCurrency(miscExpenses)}</td>
            <td class="income-table-percent">${miscExpensesPercent ? formatPercent(miscExpensesPercent) : ''}</td>
          </tr>
          ` : ''}
          <tr class="income-subtotal">
            <td class="income-table-label"><strong>Total Expenses</strong></td>
            <td class="income-table-amount"><strong>${totalExpenses ? formatCurrency(totalExpenses) : '<span class="empty-state">-</span>'}</strong></td>
            <td class="income-table-percent"><strong>${totalExpensesPercent ? formatPercent(totalExpensesPercent) : ''}</strong></td>
          </tr>
          <tr class="income-spacer">
            <td colspan="3"></td>
          </tr>
          <tr class="income-total">
            <td class="income-table-label"><strong>NET OPERATING INCOME</strong></td>
            <td class="income-table-amount"><strong>${netOperatingIncome ? formatCurrency(netOperatingIncome) : '<span class="empty-state">-</span>'}</strong></td>
            <td class="income-table-percent"><strong>${noiPercent ? formatPercent(noiPercent) : ''}</strong></td>
          </tr>
        </tbody>
      </table>

      <!-- PAGE BREAK -->
      <div style="page-break-before: always;"></div>

      <!-- PAGES 11-12: Capitalization Rate (2 pages) -->
      <h3 class="subsection-title">Capitalization Rate Selection</h3>

      <div class="site-narrative-section">
        <p class="site-narrative-text">To determine the appropriate capitalization rate for the subject property, consideration is given to:</p>
        <ul style="margin-left: 1.5rem; margin-top: 0.5rem;">
          <li>Alternative investment rates</li>
          <li>Investor activity and trends</li>
          <li>The property's income, location, and physical characteristics</li>
          <li>Comparable sales and market activity</li>
        </ul>
      </div>

      <!-- Alternative Investment Rates -->
      <h4 class="site-narrative-label" style="margin-top: 1.5rem;">Alternative Investment Rates</h4>
      <div class="site-narrative-section">
        <p class="site-narrative-text">${alternativeInvestmentRates}</p>
      </div>

      <!-- Investment Activity and Trends -->
      ${investmentTrends ? `
      <h4 class="site-narrative-label" style="margin-top: 1.5rem;">Investment Activity and Trends</h4>
      <div class="site-narrative-section">
        <p class="site-narrative-text">${investmentTrends}</p>
      </div>
      ` : ''}

      <!-- PAGE BREAK -->
      <div style="page-break-before: always;"></div>

      <!-- Cap Rate Market Survey -->
      <h4 class="site-narrative-label">Capitalization Rate Market Survey</h4>
      ${capRateSurvey ? `
        <div class="site-narrative-section">
          <p class="site-narrative-text">${capRateSurvey}</p>
        </div>
      ` : `
        <div class="site-narrative-section">
          <p class="site-narrative-text">Capitalization rates are developed based upon comparable property sales in the following table.</p>
        </div>
      `}

      ${capRateAnalysis ? `
        <div class="site-narrative-section" style="margin-top: 1rem;">
          <p class="site-narrative-text">${capRateAnalysis}</p>
        </div>
      ` : ''}

      ${bandOfInvestment ? `
      <!-- Band of Investment -->
      <h4 class="site-narrative-label" style="margin-top: 1.5rem;">Band of Investment Analysis</h4>
      <div class="site-narrative-section">
        <p class="site-narrative-text">${bandOfInvestment}</p>
      </div>
      ` : ''}

      <!-- Cap Rate Conclusion -->
      <h4 class="site-narrative-label" style="margin-top: 1.5rem;">Capitalization Rate Conclusion</h4>
      <div class="site-narrative-section">
        <p class="site-narrative-text">${capRateConclusion || `Based on these indicators and the subject's characteristics, average location, vintage, and amenity offering, a cap rate of ${capRate ? formatPercent(capRate) : '[X.XX%]'} is considered appropriate for valuing the subject on an as stabilized basis. This aligns with recent market activity for similar assets in comparable locations.`}</p>
      </div>

      <table class="site-table" style="margin-top: 1rem;">
        <tbody>
          <tr style="background: #1a365d; color: white;">
            <td class="site-table-label"><strong>Concluded Capitalization Rate</strong></td>
            <td class="site-table-value"><strong>${capRate ? formatPercent(capRate) : '<span class="empty-state">-</span>'}</strong></td>
          </tr>
        </tbody>
      </table>

      <!-- PAGE BREAK -->
      <div style="page-break-before: always;"></div>

      <!-- PAGE 13: Direct Capitalization (1 page) -->
      <h3 class="subsection-title">Direct Capitalization Calculation</h3>

      <div class="site-narrative-section">
        <p class="site-narrative-text">The direct capitalization method converts a single year's net operating income into an indication of value by dividing the NOI by an appropriate capitalization rate. The calculation is as follows:</p>
      </div>

      <table class="cap-value-table" style="margin-top: 1rem;">
        <thead>
          <tr>
            <th class="cap-table-label">Component</th>
            <th class="cap-table-value">Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="cap-table-label">Net Operating Income (NOI)</td>
            <td class="cap-table-value">${noi ? formatCurrency(noi) : (netOperatingIncome ? formatCurrency(netOperatingIncome) : '<span class="empty-state">-</span>')}</td>
          </tr>
          <tr>
            <td class="cap-table-label">Capitalization Rate</td>
            <td class="cap-table-value">${capRate ? formatPercent(capRate) : '<span class="empty-state">-</span>'}</td>
          </tr>
          <tr class="cap-value-total">
            <td class="cap-table-label"><strong>Indicated Value (Rounded)</strong></td>
            <td class="cap-table-value"><strong>${indicatedValue ? formatCurrency(indicatedValue) : '<span class="empty-state">-</span>'}</strong></td>
          </tr>
        </tbody>
      </table>

      <div class="site-narrative-section" style="margin-top: 1.5rem;">
        <p class="site-narrative-text">The direct capitalization method indicates a value of <strong>${indicatedValue ? formatCurrency(indicatedValue) : '[VALUE]'}</strong> for the subject property in its ${valueScenario || 'As Stabilized'} condition.</p>
      </div>

      <!-- PAGE BREAK -->
      <div style="page-break-before: always;"></div>

      <!-- PAGE 14: Income Approach Conclusion (1 page) -->
      <h3 class="subsection-title">Income Approach Conclusion</h3>

      <div class="site-narrative-section">
        <p class="site-narrative-text">${incomeApproachConclusion}</p>
      </div>

      <table class="site-table" style="margin-top: 1.5rem;">
        <thead>
          <tr style="background: #1a365d; color: white;">
            <th class="site-table-label" colspan="2"><strong>Income Approach Summary</strong></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="site-table-label">Valuation Method</td>
            <td class="site-table-value">Direct Capitalization</td>
          </tr>
          <tr>
            <td class="site-table-label">Net Operating Income</td>
            <td class="site-table-value">${netOperatingIncome ? formatCurrency(netOperatingIncome) : '<span class="empty-state">-</span>'}</td>
          </tr>
          <tr>
            <td class="site-table-label">Capitalization Rate</td>
            <td class="site-table-value">${capRate ? formatPercent(capRate) : '<span class="empty-state">-</span>'}</td>
          </tr>
          <tr style="background: #f3f4f6; font-weight: bold;">
            <td class="site-table-label"><strong>Indicated Value by Income Approach</strong></td>
            <td class="site-table-value"><strong>${indicatedValue ? formatCurrency(indicatedValue) : '<span class="empty-state">-</span>'}</strong></td>
          </tr>
        </tbody>
      </table>

      <div class="site-narrative-section" style="margin-top: 1.5rem; padding: 1rem; background: #f9fafb; border-left: 4px solid #1a365d;">
        <p class="site-narrative-text" style="margin: 0;"><strong>Value Conclusion:</strong> Based on the Income Capitalization Approach utilizing the Direct Capitalization method, the market value of the subject property as of ${valuationDate || '[DATE]'} is indicated to be <strong>${indicatedValue ? formatCurrency(indicatedValue) : '[VALUE]'}</strong>.</p>
      </div>

      ${!potentialGrossIncome && !effectiveGrossIncome && !netOperatingIncome && !capRate ? `
        <div class="empty-state" style="margin-top: 2rem;">No income approach data provided. Complete the Pro Forma Operating Statement and Capitalization Rate fields to generate the full income approach analysis.</div>
      ` : ''}
    </div>
    `;
  };

  // Helper function to render the SALES section with custom template
  // Helper function to render the SALES section with custom template - EXPANDED TO 11 PAGES
  const renderSalesSection = (section: ReportSection): string => {
    // Helper to calculate Price/Unit
    const calculatePricePerUnit = (salePrice: string, numUnits: string): string => {
      const price = parseFloat(salePrice.replace(/[^0-9.-]/g, ''));
      const units = parseFloat(numUnits.replace(/[^0-9.-]/g, ''));
      if (isNaN(price) || isNaN(units) || units === 0) return '-';
      return formatCurrency(String(price / units));
    };

    // Helper to calculate Price/SF
    const calculatePricePerSF = (salePrice: string, gba: string): string => {
      const price = parseFloat(salePrice.replace(/[^0-9.-]/g, ''));
      const sf = parseFloat(gba.replace(/[^0-9.-]/g, ''));
      if (isNaN(price) || isNaN(sf) || sf === 0) return '-';
      const pricePerSF = price / sf;
      return `$${pricePerSF.toFixed(2)}`;
    };

    // Subject Property Summary data
    const subjectNumUnits = getFieldValue(section, 'subject-num-units');
    const subjectGba = getFieldValue(section, 'subject-gba');
    const subjectYearBuilt = getFieldValue(section, 'subject-year-built');
    const subjectSiteArea = getFieldValue(section, 'subject-site-area');
    const subjectCondition = getFieldValue(section, 'subject-condition');

    // Sale 1 data
    const sale1Name = getFieldValue(section, 'sale1-name');
    const sale1Address = getFieldValue(section, 'sale1-address');
    const sale1SaleDate = getFieldValue(section, 'sale1-sale-date');
    const sale1SalePrice = getFieldValue(section, 'sale1-sale-price');
    const sale1NumUnits = getFieldValue(section, 'sale1-num-units');
    const sale1Gba = getFieldValue(section, 'sale1-gba');
    const sale1YearBuilt = getFieldValue(section, 'sale1-year-built');
    const sale1CapRate = getFieldValue(section, 'sale1-cap-rate');
    const sale1SiteArea = getFieldValue(section, 'sale1-site-area');
    const sale1Condition = getFieldValue(section, 'sale1-condition');
    const sale1Description = getFieldValue(section, 'sale1-description');

    // Sale 2 data
    const sale2Name = getFieldValue(section, 'sale2-name');
    const sale2Address = getFieldValue(section, 'sale2-address');
    const sale2SaleDate = getFieldValue(section, 'sale2-sale-date');
    const sale2SalePrice = getFieldValue(section, 'sale2-sale-price');
    const sale2NumUnits = getFieldValue(section, 'sale2-num-units');
    const sale2Gba = getFieldValue(section, 'sale2-gba');
    const sale2YearBuilt = getFieldValue(section, 'sale2-year-built');
    const sale2CapRate = getFieldValue(section, 'sale2-cap-rate');
    const sale2SiteArea = getFieldValue(section, 'sale2-site-area');
    const sale2Condition = getFieldValue(section, 'sale2-condition');
    const sale2Description = getFieldValue(section, 'sale2-description');

    // Sale 3 data
    const sale3Name = getFieldValue(section, 'sale3-name');
    const sale3Address = getFieldValue(section, 'sale3-address');
    const sale3SaleDate = getFieldValue(section, 'sale3-sale-date');
    const sale3SalePrice = getFieldValue(section, 'sale3-sale-price');
    const sale3NumUnits = getFieldValue(section, 'sale3-num-units');
    const sale3Gba = getFieldValue(section, 'sale3-gba');
    const sale3YearBuilt = getFieldValue(section, 'sale3-year-built');
    const sale3CapRate = getFieldValue(section, 'sale3-cap-rate');
    const sale3SiteArea = getFieldValue(section, 'sale3-site-area');
    const sale3Condition = getFieldValue(section, 'sale3-condition');
    const sale3Description = getFieldValue(section, 'sale3-description');

    // Sale 4 data - NEW
    const sale4Name = getFieldValue(section, 'sale4-name');
    const sale4Address = getFieldValue(section, 'sale4-address');
    const sale4SaleDate = getFieldValue(section, 'sale4-sale-date');
    const sale4SalePrice = getFieldValue(section, 'sale4-sale-price');
    const sale4NumUnits = getFieldValue(section, 'sale4-num-units');
    const sale4Gba = getFieldValue(section, 'sale4-gba');
    const sale4YearBuilt = getFieldValue(section, 'sale4-year-built');
    const sale4CapRate = getFieldValue(section, 'sale4-cap-rate');
    const sale4SiteArea = getFieldValue(section, 'sale4-site-area');
    const sale4Condition = getFieldValue(section, 'sale4-condition');
    const sale4Description = getFieldValue(section, 'sale4-description');

    // Sale 5 data - NEW
    const sale5Name = getFieldValue(section, 'sale5-name');
    const sale5Address = getFieldValue(section, 'sale5-address');
    const sale5SaleDate = getFieldValue(section, 'sale5-sale-date');
    const sale5SalePrice = getFieldValue(section, 'sale5-sale-price');
    const sale5NumUnits = getFieldValue(section, 'sale5-num-units');
    const sale5Gba = getFieldValue(section, 'sale5-gba');
    const sale5YearBuilt = getFieldValue(section, 'sale5-year-built');
    const sale5CapRate = getFieldValue(section, 'sale5-cap-rate');
    const sale5SiteArea = getFieldValue(section, 'sale5-site-area');
    const sale5Condition = getFieldValue(section, 'sale5-condition');
    const sale5Description = getFieldValue(section, 'sale5-description');

    // Sale 6 data - NEW
    const sale6Name = getFieldValue(section, 'sale6-name');
    const sale6Address = getFieldValue(section, 'sale6-address');
    const sale6SaleDate = getFieldValue(section, 'sale6-sale-date');
    const sale6SalePrice = getFieldValue(section, 'sale6-sale-price');
    const sale6NumUnits = getFieldValue(section, 'sale6-num-units');
    const sale6Gba = getFieldValue(section, 'sale6-gba');
    const sale6YearBuilt = getFieldValue(section, 'sale6-year-built');
    const sale6CapRate = getFieldValue(section, 'sale6-cap-rate');
    const sale6SiteArea = getFieldValue(section, 'sale6-site-area');
    const sale6Condition = getFieldValue(section, 'sale6-condition');
    const sale6Description = getFieldValue(section, 'sale6-description');

    // Sales Comparison Value Conclusion
    const salesValueIndication = getFieldValue(section, 'sales-value-indication');
    const adjustmentSummary = getFieldValue(section, 'adjustment-summary');
    const salesMethodology = getFieldValue(section, 'sales-methodology');
    const salesReconciliation = getFieldValue(section, 'sales-reconciliation');

    // Adjustment data for Sale 1
    const sale1AdjPropertyRights = getFieldValue(section, 'comp1-adj-property-rights');
    const sale1AdjFinancing = getFieldValue(section, 'comp1-adj-financing');
    const sale1AdjConditionsSale = getFieldValue(section, 'comp1-adj-conditions-sale');
    const sale1AdjMarketTime = getFieldValue(section, 'comp1-adj-market-time');
    const sale1AdjLocation = getFieldValue(section, 'comp1-adj-location');
    const sale1AdjSize = getFieldValue(section, 'comp1-adj-size');
    const sale1AdjAgeCondition = getFieldValue(section, 'comp1-adj-age-condition');
    const sale1AdjOther = getFieldValue(section, 'comp1-adj-other');

    // Adjustment data for Sale 2
    const sale2AdjPropertyRights = getFieldValue(section, 'comp2-adj-property-rights');
    const sale2AdjFinancing = getFieldValue(section, 'comp2-adj-financing');
    const sale2AdjConditionsSale = getFieldValue(section, 'comp2-adj-conditions-sale');
    const sale2AdjMarketTime = getFieldValue(section, 'comp2-adj-market-time');
    const sale2AdjLocation = getFieldValue(section, 'comp2-adj-location');
    const sale2AdjSize = getFieldValue(section, 'comp2-adj-size');
    const sale2AdjAgeCondition = getFieldValue(section, 'comp2-adj-age-condition');
    const sale2AdjOther = getFieldValue(section, 'comp2-adj-other');

    // Adjustment data for Sale 3
    const sale3AdjPropertyRights = getFieldValue(section, 'comp3-adj-property-rights');
    const sale3AdjFinancing = getFieldValue(section, 'comp3-adj-financing');
    const sale3AdjConditionsSale = getFieldValue(section, 'comp3-adj-conditions-sale');
    const sale3AdjMarketTime = getFieldValue(section, 'comp3-adj-market-time');
    const sale3AdjLocation = getFieldValue(section, 'comp3-adj-location');
    const sale3AdjSize = getFieldValue(section, 'comp3-adj-size');
    const sale3AdjAgeCondition = getFieldValue(section, 'comp3-adj-age-condition');
    const sale3AdjOther = getFieldValue(section, 'comp3-adj-other');

    // Adjustment data for Sale 4
    const sale4AdjPropertyRights = getFieldValue(section, 'comp4-adj-property-rights');
    const sale4AdjFinancing = getFieldValue(section, 'comp4-adj-financing');
    const sale4AdjConditionsSale = getFieldValue(section, 'comp4-adj-conditions-sale');
    const sale4AdjMarketTime = getFieldValue(section, 'comp4-adj-market-time');
    const sale4AdjLocation = getFieldValue(section, 'comp4-adj-location');
    const sale4AdjSize = getFieldValue(section, 'comp4-adj-size');
    const sale4AdjAgeCondition = getFieldValue(section, 'comp4-adj-age-condition');
    const sale4AdjOther = getFieldValue(section, 'comp4-adj-other');

    // Adjustment data for Sale 5
    const sale5AdjPropertyRights = getFieldValue(section, 'comp5-adj-property-rights');
    const sale5AdjFinancing = getFieldValue(section, 'comp5-adj-financing');
    const sale5AdjConditionsSale = getFieldValue(section, 'comp5-adj-conditions-sale');
    const sale5AdjMarketTime = getFieldValue(section, 'comp5-adj-market-time');
    const sale5AdjLocation = getFieldValue(section, 'comp5-adj-location');
    const sale5AdjSize = getFieldValue(section, 'comp5-adj-size');
    const sale5AdjAgeCondition = getFieldValue(section, 'comp5-adj-age-condition');
    const sale5AdjOther = getFieldValue(section, 'comp5-adj-other');

    // Adjustment data for Sale 6
    const sale6AdjPropertyRights = getFieldValue(section, 'comp6-adj-property-rights');
    const sale6AdjFinancing = getFieldValue(section, 'comp6-adj-financing');
    const sale6AdjConditionsSale = getFieldValue(section, 'comp6-adj-conditions-sale');
    const sale6AdjMarketTime = getFieldValue(section, 'comp6-adj-market-time');
    const sale6AdjLocation = getFieldValue(section, 'comp6-adj-location');
    const sale6AdjSize = getFieldValue(section, 'comp6-adj-size');
    const sale6AdjAgeCondition = getFieldValue(section, 'comp6-adj-age-condition');
    const sale6AdjOther = getFieldValue(section, 'comp6-adj-other');

    // Helper function to parse percentage values
    const parsePercentage = (value: string): number => {
      if (!value) return 0;
      const numericValue = parseFloat(value.toString().replace(/[^0-9.-]/g, ''));
      return isNaN(numericValue) ? 0 : numericValue;
    };

    // Helper function to calculate net adjustment
    const calculateNetAdjustment = (...adjustments: string[]): number => {
      return adjustments.reduce((sum, adj) => sum + parsePercentage(adj), 0);
    };

    // Helper function to calculate adjusted price
    const calculateAdjustedPrice = (salePrice: string, netAdjustmentPercent: number): string => {
      if (!salePrice) return '-';
      const price = parseFloat(salePrice.replace(/[^0-9.-]/g, ''));
      if (isNaN(price)) return '-';
      const adjustedPrice = price * (1 + netAdjustmentPercent / 100);
      return formatCurrency(String(adjustedPrice));
    };

    // Calculate net adjustments for each sale
    const sale1NetAdj = calculateNetAdjustment(
      sale1AdjPropertyRights, sale1AdjFinancing, sale1AdjConditionsSale,
      sale1AdjMarketTime, sale1AdjLocation, sale1AdjSize, sale1AdjAgeCondition, sale1AdjOther
    );
    const sale2NetAdj = calculateNetAdjustment(
      sale2AdjPropertyRights, sale2AdjFinancing, sale2AdjConditionsSale,
      sale2AdjMarketTime, sale2AdjLocation, sale2AdjSize, sale2AdjAgeCondition, sale2AdjOther
    );
    const sale3NetAdj = calculateNetAdjustment(
      sale3AdjPropertyRights, sale3AdjFinancing, sale3AdjConditionsSale,
      sale3AdjMarketTime, sale3AdjLocation, sale3AdjSize, sale3AdjAgeCondition, sale3AdjOther
    );
    const sale4NetAdj = calculateNetAdjustment(
      sale4AdjPropertyRights, sale4AdjFinancing, sale4AdjConditionsSale,
      sale4AdjMarketTime, sale4AdjLocation, sale4AdjSize, sale4AdjAgeCondition, sale4AdjOther
    );
    const sale5NetAdj = calculateNetAdjustment(
      sale5AdjPropertyRights, sale5AdjFinancing, sale5AdjConditionsSale,
      sale5AdjMarketTime, sale5AdjLocation, sale5AdjSize, sale5AdjAgeCondition, sale5AdjOther
    );
    const sale6NetAdj = calculateNetAdjustment(
      sale6AdjPropertyRights, sale6AdjFinancing, sale6AdjConditionsSale,
      sale6AdjMarketTime, sale6AdjLocation, sale6AdjSize, sale6AdjAgeCondition, sale6AdjOther
    );

    // Calculate adjusted prices
    const sale1AdjustedPrice = calculateAdjustedPrice(sale1SalePrice, sale1NetAdj);
    const sale2AdjustedPrice = calculateAdjustedPrice(sale2SalePrice, sale2NetAdj);
    const sale3AdjustedPrice = calculateAdjustedPrice(sale3SalePrice, sale3NetAdj);
    const sale4AdjustedPrice = calculateAdjustedPrice(sale4SalePrice, sale4NetAdj);
    const sale5AdjustedPrice = calculateAdjustedPrice(sale5SalePrice, sale5NetAdj);
    const sale6AdjustedPrice = calculateAdjustedPrice(sale6SalePrice, sale6NetAdj);

    // Helper to format adjustment percentage display
    const formatAdjustment = (value: string): string => {
      if (!value) return '0%';
      const numValue = parsePercentage(value);
      if (numValue === 0) return '0%';
      return numValue > 0 ? `+${numValue}%` : `${numValue}%`;
    };

    return `
    <div class="section">
      <h2 class="section-title">Sales Comparison Approach</h2>
  
      <!-- PAGE 1: Introduction & Methodology -->
      <h3 class="subsection-title">Sales Comparison Methodology</h3>
      <div class="site-narrative-section">
        <p class="site-narrative-text">
          ${salesMethodology || 'The Sales Comparison Approach is predicated on the principle of substitution, which holds that a prudent buyer will not pay more for a property than the cost of acquiring an equally desirable substitute property in the absence of complicating factors such as undue delay. In applying this approach, recent sales of properties similar to the subject are analyzed and compared to the subject property. The sales are then adjusted for differences between the comparables and the subject property to estimate the market value of the subject.'}
        </p>
        <p class="site-narrative-text">
          In this analysis, six comparable sales have been selected based on similarity to the subject property in terms of location, size, age, condition, and physical characteristics. Each comparable has been verified and analyzed for factors including property rights conveyed, financing terms, conditions of sale, market conditions (time), location, physical characteristics, and any other factors that may affect value.
        </p>
      </div>
  
      <!-- Subject Property Summary Table -->
      <h3 class="subsection-title" style="margin-top: 1.5rem;">Subject Property Summary</h3>
      <table class="site-table">
        <thead>
          <tr>
            <th class="site-table-label" style="background: #1a365d; color: white;">Item</th>
            <th class="site-table-value" style="background: #1a365d; color: white;">Subject</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="site-table-label">Number of Units</td>
            <td class="site-table-value">${subjectNumUnits || '<span class="empty-state">—</span>'}</td>
          </tr>
          <tr>
            <td class="site-table-label">GBA</td>
            <td class="site-table-value">${subjectGba ? `${Number(subjectGba).toLocaleString()} SF` : '<span class="empty-state">—</span>'}</td>
          </tr>
          <tr>
            <td class="site-table-label">Year Built</td>
            <td class="site-table-value">${subjectYearBuilt || '<span class="empty-state">—</span>'}</td>
          </tr>
          <tr>
            <td class="site-table-label">Site Area</td>
            <td class="site-table-value">${subjectSiteArea ? `${Number(subjectSiteArea).toLocaleString()} SF` : '<span class="empty-state">—</span>'}</td>
          </tr>
          <tr>
            <td class="site-table-label">Condition</td>
            <td class="site-table-value">${subjectCondition || '<span class="empty-state">—</span>'}</td>
          </tr>
        </tbody>
      </table>
  
      <!-- PAGE BREAK - PAGE 2: Comp 1 & 2 -->
      <div style="page-break-before: always;"></div>
  
      <!-- Comparable Sale 1 -->
      ${sale1Name || sale1Address ? `
        <h3 class="subsection-title">Comparable Sale 1</h3>
        <table class="site-table">
          <tbody>
            <tr>
              <td class="site-table-label">Property</td>
              <td class="site-table-value">${sale1Name || '<span class="empty-state">—</span>'}</td>
            </tr>
            <tr>
              <td class="site-table-label">Address</td>
              <td class="site-table-value">${sale1Address || '<span class="empty-state">—</span>'}</td>
            </tr>
            <tr>
              <td class="site-table-label">Sale Date</td>
              <td class="site-table-value">${sale1SaleDate || '<span class="empty-state">—</span>'}</td>
            </tr>
            <tr>
              <td class="site-table-label">Sale Price</td>
              <td class="site-table-value">${sale1SalePrice ? formatCurrency(sale1SalePrice) : '<span class="empty-state">—</span>'}</td>
            </tr>
            <tr>
              <td class="site-table-label">Units</td>
              <td class="site-table-value">${sale1NumUnits || '<span class="empty-state">—</span>'}</td>
            </tr>
            <tr>
              <td class="site-table-label">Price/Unit</td>
              <td class="site-table-value">${sale1SalePrice && sale1NumUnits ? calculatePricePerUnit(sale1SalePrice, sale1NumUnits) : '<span class="empty-state">-</span>'}</td>
            </tr>
            <tr>
              <td class="site-table-label">GBA</td>
              <td class="site-table-value">${sale1Gba ? `${Number(sale1Gba).toLocaleString()} SF` : '<span class="empty-state">—</span>'}</td>
            </tr>
            <tr>
              <td class="site-table-label">Price/SF</td>
              <td class="site-table-value">${sale1SalePrice && sale1Gba ? calculatePricePerSF(sale1SalePrice, sale1Gba) : '<span class="empty-state">-</span>'}</td>
            </tr>
            <tr>
              <td class="site-table-label">Year Built</td>
              <td class="site-table-value">${sale1YearBuilt || '<span class="empty-state">—</span>'}</td>
            </tr>
            <tr>
              <td class="site-table-label">Cap Rate</td>
              <td class="site-table-value">${sale1CapRate ? `${sale1CapRate}%` : '<span class="empty-state">—</span>'}</td>
            </tr>
          </tbody>
        </table>
      ` : ''}
  
      <!-- Comparable Sale 2 -->
      ${sale2Name || sale2Address ? `
        <h3 class="subsection-title" style="margin-top: 1.5rem;">Comparable Sale 2</h3>
        <table class="site-table">
          <tbody>
            <tr>
              <td class="site-table-label">Property</td>
              <td class="site-table-value">${sale2Name || '<span class="empty-state">—</span>'}</td>
            </tr>
            <tr>
              <td class="site-table-label">Address</td>
              <td class="site-table-value">${sale2Address || '<span class="empty-state">—</span>'}</td>
            </tr>
            <tr>
              <td class="site-table-label">Sale Date</td>
              <td class="site-table-value">${sale2SaleDate || '<span class="empty-state">—</span>'}</td>
            </tr>
            <tr>
              <td class="site-table-label">Sale Price</td>
              <td class="site-table-value">${sale2SalePrice ? formatCurrency(sale2SalePrice) : '<span class="empty-state">—</span>'}</td>
            </tr>
            <tr>
              <td class="site-table-label">Units</td>
              <td class="site-table-value">${sale2NumUnits || '<span class="empty-state">—</span>'}</td>
            </tr>
            <tr>
              <td class="site-table-label">Price/Unit</td>
              <td class="site-table-value">${sale2SalePrice && sale2NumUnits ? calculatePricePerUnit(sale2SalePrice, sale2NumUnits) : '<span class="empty-state">-</span>'}</td>
            </tr>
            <tr>
              <td class="site-table-label">GBA</td>
              <td class="site-table-value">${sale2Gba ? `${Number(sale2Gba).toLocaleString()} SF` : '<span class="empty-state">—</span>'}</td>
            </tr>
            <tr>
              <td class="site-table-label">Price/SF</td>
              <td class="site-table-value">${sale2SalePrice && sale2Gba ? calculatePricePerSF(sale2SalePrice, sale2Gba) : '<span class="empty-state">-</span>'}</td>
            </tr>
            <tr>
              <td class="site-table-label">Year Built</td>
              <td class="site-table-value">${sale2YearBuilt || '<span class="empty-state">—</span>'}</td>
            </tr>
            <tr>
              <td class="site-table-label">Cap Rate</td>
              <td class="site-table-value">${sale2CapRate ? `${sale2CapRate}%` : '<span class="empty-state">—</span>'}</td>
            </tr>
          </tbody>
        </table>
      ` : ''}
  
      <!-- PAGE BREAK - PAGE 3: Comp 3 & 4 -->
      <div style="page-break-before: always;"></div>
  
      <!-- Comparable Sale 3 -->
      ${sale3Name || sale3Address ? `
        <h3 class="subsection-title">Comparable Sale 3</h3>
        <table class="site-table">
          <tbody>
            <tr>
              <td class="site-table-label">Property</td>
              <td class="site-table-value">${sale3Name || '<span class="empty-state">—</span>'}</td>
            </tr>
            <tr>
              <td class="site-table-label">Address</td>
              <td class="site-table-value">${sale3Address || '<span class="empty-state">—</span>'}</td>
            </tr>
            <tr>
              <td class="site-table-label">Sale Date</td>
              <td class="site-table-value">${sale3SaleDate || '<span class="empty-state">—</span>'}</td>
            </tr>
            <tr>
              <td class="site-table-label">Sale Price</td>
              <td class="site-table-value">${sale3SalePrice ? formatCurrency(sale3SalePrice) : '<span class="empty-state">—</span>'}</td>
            </tr>
            <tr>
              <td class="site-table-label">Units</td>
              <td class="site-table-value">${sale3NumUnits || '<span class="empty-state">—</span>'}</td>
            </tr>
            <tr>
              <td class="site-table-label">Price/Unit</td>
              <td class="site-table-value">${sale3SalePrice && sale3NumUnits ? calculatePricePerUnit(sale3SalePrice, sale3NumUnits) : '<span class="empty-state">-</span>'}</td>
            </tr>
            <tr>
              <td class="site-table-label">GBA</td>
              <td class="site-table-value">${sale3Gba ? `${Number(sale3Gba).toLocaleString()} SF` : '<span class="empty-state">—</span>'}</td>
            </tr>
            <tr>
              <td class="site-table-label">Price/SF</td>
              <td class="site-table-value">${sale3SalePrice && sale3Gba ? calculatePricePerSF(sale3SalePrice, sale3Gba) : '<span class="empty-state">-</span>'}</td>
            </tr>
            <tr>
              <td class="site-table-label">Year Built</td>
              <td class="site-table-value">${sale3YearBuilt || '<span class="empty-state">—</span>'}</td>
            </tr>
            <tr>
              <td class="site-table-label">Cap Rate</td>
              <td class="site-table-value">${sale3CapRate ? `${sale3CapRate}%` : '<span class="empty-state">—</span>'}</td>
            </tr>
          </tbody>
        </table>
      ` : ''}
  
      <!-- Comparable Sale 4 - NEW -->
      ${sale4Name || sale4Address ? `
        <h3 class="subsection-title" style="margin-top: 1.5rem;">Comparable Sale 4</h3>
        <table class="site-table">
          <tbody>
            <tr>
              <td class="site-table-label">Property</td>
              <td class="site-table-value">${sale4Name || '<span class="empty-state">—</span>'}</td>
            </tr>
            <tr>
              <td class="site-table-label">Address</td>
              <td class="site-table-value">${sale4Address || '<span class="empty-state">—</span>'}</td>
            </tr>
            <tr>
              <td class="site-table-label">Sale Date</td>
              <td class="site-table-value">${sale4SaleDate || '<span class="empty-state">—</span>'}</td>
            </tr>
            <tr>
              <td class="site-table-label">Sale Price</td>
              <td class="site-table-value">${sale4SalePrice ? formatCurrency(sale4SalePrice) : '<span class="empty-state">—</span>'}</td>
            </tr>
            <tr>
              <td class="site-table-label">Units</td>
              <td class="site-table-value">${sale4NumUnits || '<span class="empty-state">—</span>'}</td>
            </tr>
            <tr>
              <td class="site-table-label">Price/Unit</td>
              <td class="site-table-value">${sale4SalePrice && sale4NumUnits ? calculatePricePerUnit(sale4SalePrice, sale4NumUnits) : '<span class="empty-state">-</span>'}</td>
            </tr>
            <tr>
              <td class="site-table-label">GBA</td>
              <td class="site-table-value">${sale4Gba ? `${Number(sale4Gba).toLocaleString()} SF` : '<span class="empty-state">—</span>'}</td>
            </tr>
            <tr>
              <td class="site-table-label">Price/SF</td>
              <td class="site-table-value">${sale4SalePrice && sale4Gba ? calculatePricePerSF(sale4SalePrice, sale4Gba) : '<span class="empty-state">-</span>'}</td>
            </tr>
            <tr>
              <td class="site-table-label">Year Built</td>
              <td class="site-table-value">${sale4YearBuilt || '<span class="empty-state">—</span>'}</td>
            </tr>
            <tr>
              <td class="site-table-label">Cap Rate</td>
              <td class="site-table-value">${sale4CapRate ? `${sale4CapRate}%` : '<span class="empty-state">—</span>'}</td>
            </tr>
          </tbody>
        </table>
      ` : ''}
  
      <!-- PAGE BREAK - PAGE 4: Comp 5 & 6 -->
      <div style="page-break-before: always;"></div>
  
      <!-- Comparable Sale 5 - NEW -->
      ${sale5Name || sale5Address ? `
        <h3 class="subsection-title">Comparable Sale 5</h3>
        <table class="site-table">
          <tbody>
            <tr>
              <td class="site-table-label">Property</td>
              <td class="site-table-value">${sale5Name || '<span class="empty-state">—</span>'}</td>
            </tr>
            <tr>
              <td class="site-table-label">Address</td>
              <td class="site-table-value">${sale5Address || '<span class="empty-state">—</span>'}</td>
            </tr>
            <tr>
              <td class="site-table-label">Sale Date</td>
              <td class="site-table-value">${sale5SaleDate || '<span class="empty-state">—</span>'}</td>
            </tr>
            <tr>
              <td class="site-table-label">Sale Price</td>
              <td class="site-table-value">${sale5SalePrice ? formatCurrency(sale5SalePrice) : '<span class="empty-state">—</span>'}</td>
            </tr>
            <tr>
              <td class="site-table-label">Units</td>
              <td class="site-table-value">${sale5NumUnits || '<span class="empty-state">—</span>'}</td>
            </tr>
            <tr>
              <td class="site-table-label">Price/Unit</td>
              <td class="site-table-value">${sale5SalePrice && sale5NumUnits ? calculatePricePerUnit(sale5SalePrice, sale5NumUnits) : '<span class="empty-state">-</span>'}</td>
            </tr>
            <tr>
              <td class="site-table-label">GBA</td>
              <td class="site-table-value">${sale5Gba ? `${Number(sale5Gba).toLocaleString()} SF` : '<span class="empty-state">—</span>'}</td>
            </tr>
            <tr>
              <td class="site-table-label">Price/SF</td>
              <td class="site-table-value">${sale5SalePrice && sale5Gba ? calculatePricePerSF(sale5SalePrice, sale5Gba) : '<span class="empty-state">-</span>'}</td>
            </tr>
            <tr>
              <td class="site-table-label">Year Built</td>
              <td class="site-table-value">${sale5YearBuilt || '<span class="empty-state">—</span>'}</td>
            </tr>
            <tr>
              <td class="site-table-label">Cap Rate</td>
              <td class="site-table-value">${sale5CapRate ? `${sale5CapRate}%` : '<span class="empty-state">—</span>'}</td>
            </tr>
          </tbody>
        </table>
      ` : ''}
  
      <!-- Comparable Sale 6 - NEW -->
      ${sale6Name || sale6Address ? `
        <h3 class="subsection-title" style="margin-top: 1.5rem;">Comparable Sale 6</h3>
        <table class="site-table">
          <tbody>
            <tr>
              <td class="site-table-label">Property</td>
              <td class="site-table-value">${sale6Name || '<span class="empty-state">—</span>'}</td>
            </tr>
            <tr>
              <td class="site-table-label">Address</td>
              <td class="site-table-value">${sale6Address || '<span class="empty-state">—</span>'}</td>
            </tr>
            <tr>
              <td class="site-table-label">Sale Date</td>
              <td class="site-table-value">${sale6SaleDate || '<span class="empty-state">—</span>'}</td>
            </tr>
            <tr>
              <td class="site-table-label">Sale Price</td>
              <td class="site-table-value">${sale6SalePrice ? formatCurrency(sale6SalePrice) : '<span class="empty-state">—</span>'}</td>
            </tr>
            <tr>
              <td class="site-table-label">Units</td>
              <td class="site-table-value">${sale6NumUnits || '<span class="empty-state">—</span>'}</td>
            </tr>
            <tr>
              <td class="site-table-label">Price/Unit</td>
              <td class="site-table-value">${sale6SalePrice && sale6NumUnits ? calculatePricePerUnit(sale6SalePrice, sale6NumUnits) : '<span class="empty-state">-</span>'}</td>
            </tr>
            <tr>
              <td class="site-table-label">GBA</td>
              <td class="site-table-value">${sale6Gba ? `${Number(sale6Gba).toLocaleString()} SF` : '<span class="empty-state">—</span>'}</td>
            </tr>
            <tr>
              <td class="site-table-label">Price/SF</td>
              <td class="site-table-value">${sale6SalePrice && sale6Gba ? calculatePricePerSF(sale6SalePrice, sale6Gba) : '<span class="empty-state">-</span>'}</td>
            </tr>
            <tr>
              <td class="site-table-label">Year Built</td>
              <td class="site-table-value">${sale6YearBuilt || '<span class="empty-state">—</span>'}</td>
            </tr>
            <tr>
              <td class="site-table-label">Cap Rate</td>
              <td class="site-table-value">${sale6CapRate ? `${sale6CapRate}%` : '<span class="empty-state">—</span>'}</td>
            </tr>
          </tbody>
        </table>
      ` : ''}
  
      <!-- PAGE BREAK - PAGE 5-6: Comparable Sales Summary Table -->
      <div style="page-break-before: always;"></div>
  
      <h3 class="subsection-title">Comparable Sales Summary</h3>
      <table class="site-table" style="font-size: 0.85rem;">
        <thead>
          <tr style="background: #1a365d; color: white;">
            <th style="padding: 0.5rem;">Property</th>
            <th style="padding: 0.5rem;">Address</th>
            <th style="padding: 0.5rem;">Sale Date</th>
            <th style="padding: 0.5rem;">Sale Price</th>
            <th style="padding: 0.5rem;">Units</th>
            <th style="padding: 0.5rem;">GBA</th>
            <th style="padding: 0.5rem;">Price/Unit</th>
            <th style="padding: 0.5rem;">Price/SF</th>
          </tr>
        </thead>
        <tbody>
          <tr style="background: #f5f5f5; font-weight: bold;">
            <td style="padding: 0.5rem;">Subject</td>
            <td style="padding: 0.5rem;">${streetAddress ? `${streetAddress}, ${city}, ${province}` : 'Subject Property'}</td>
            <td style="padding: 0.5rem;">-</td>
            <td style="padding: 0.5rem;">-</td>
            <td style="padding: 0.5rem;">${subjectNumUnits || '-'}</td>
            <td style="padding: 0.5rem;">${subjectGba ? `${Number(subjectGba).toLocaleString()} SF` : '-'}</td>
            <td style="padding: 0.5rem;">-</td>
            <td style="padding: 0.5rem;">-</td>
          </tr>
          ${sale1Name || sale1Address ? `
          <tr>
            <td style="padding: 0.5rem;">Sale 1</td>
            <td style="padding: 0.5rem;">${sale1Address || sale1Name || '-'}</td>
            <td style="padding: 0.5rem;">${sale1SaleDate || '-'}</td>
            <td style="padding: 0.5rem;">${sale1SalePrice ? formatCurrency(sale1SalePrice) : '-'}</td>
            <td style="padding: 0.5rem;">${sale1NumUnits || '-'}</td>
            <td style="padding: 0.5rem;">${sale1Gba ? `${Number(sale1Gba).toLocaleString()} SF` : '-'}</td>
            <td style="padding: 0.5rem;">${sale1SalePrice && sale1NumUnits ? calculatePricePerUnit(sale1SalePrice, sale1NumUnits) : '-'}</td>
            <td style="padding: 0.5rem;">${sale1SalePrice && sale1Gba ? calculatePricePerSF(sale1SalePrice, sale1Gba) : '-'}</td>
          </tr>
          ` : ''}
          ${sale2Name || sale2Address ? `
          <tr>
            <td style="padding: 0.5rem;">Sale 2</td>
            <td style="padding: 0.5rem;">${sale2Address || sale2Name || '-'}</td>
            <td style="padding: 0.5rem;">${sale2SaleDate || '-'}</td>
            <td style="padding: 0.5rem;">${sale2SalePrice ? formatCurrency(sale2SalePrice) : '-'}</td>
            <td style="padding: 0.5rem;">${sale2NumUnits || '-'}</td>
            <td style="padding: 0.5rem;">${sale2Gba ? `${Number(sale2Gba).toLocaleString()} SF` : '-'}</td>
            <td style="padding: 0.5rem;">${sale2SalePrice && sale2NumUnits ? calculatePricePerUnit(sale2SalePrice, sale2NumUnits) : '-'}</td>
            <td style="padding: 0.5rem;">${sale2SalePrice && sale2Gba ? calculatePricePerSF(sale2SalePrice, sale2Gba) : '-'}</td>
          </tr>
          ` : ''}
          ${sale3Name || sale3Address ? `
          <tr>
            <td style="padding: 0.5rem;">Sale 3</td>
            <td style="padding: 0.5rem;">${sale3Address || sale3Name || '-'}</td>
            <td style="padding: 0.5rem;">${sale3SaleDate || '-'}</td>
            <td style="padding: 0.5rem;">${sale3SalePrice ? formatCurrency(sale3SalePrice) : '-'}</td>
            <td style="padding: 0.5rem;">${sale3NumUnits || '-'}</td>
            <td style="padding: 0.5rem;">${sale3Gba ? `${Number(sale3Gba).toLocaleString()} SF` : '-'}</td>
            <td style="padding: 0.5rem;">${sale3SalePrice && sale3NumUnits ? calculatePricePerUnit(sale3SalePrice, sale3NumUnits) : '-'}</td>
            <td style="padding: 0.5rem;">${sale3SalePrice && sale3Gba ? calculatePricePerSF(sale3SalePrice, sale3Gba) : '-'}</td>
          </tr>
          ` : ''}
          ${sale4Name || sale4Address ? `
          <tr>
            <td style="padding: 0.5rem;">Sale 4</td>
            <td style="padding: 0.5rem;">${sale4Address || sale4Name || '-'}</td>
            <td style="padding: 0.5rem;">${sale4SaleDate || '-'}</td>
            <td style="padding: 0.5rem;">${sale4SalePrice ? formatCurrency(sale4SalePrice) : '-'}</td>
            <td style="padding: 0.5rem;">${sale4NumUnits || '-'}</td>
            <td style="padding: 0.5rem;">${sale4Gba ? `${Number(sale4Gba).toLocaleString()} SF` : '-'}</td>
            <td style="padding: 0.5rem;">${sale4SalePrice && sale4NumUnits ? calculatePricePerUnit(sale4SalePrice, sale4NumUnits) : '-'}</td>
            <td style="padding: 0.5rem;">${sale4SalePrice && sale4Gba ? calculatePricePerSF(sale4SalePrice, sale4Gba) : '-'}</td>
          </tr>
          ` : ''}
          ${sale5Name || sale5Address ? `
          <tr>
            <td style="padding: 0.5rem;">Sale 5</td>
            <td style="padding: 0.5rem;">${sale5Address || sale5Name || '-'}</td>
            <td style="padding: 0.5rem;">${sale5SaleDate || '-'}</td>
            <td style="padding: 0.5rem;">${sale5SalePrice ? formatCurrency(sale5SalePrice) : '-'}</td>
            <td style="padding: 0.5rem;">${sale5NumUnits || '-'}</td>
            <td style="padding: 0.5rem;">${sale5Gba ? `${Number(sale5Gba).toLocaleString()} SF` : '-'}</td>
            <td style="padding: 0.5rem;">${sale5SalePrice && sale5NumUnits ? calculatePricePerUnit(sale5SalePrice, sale5NumUnits) : '-'}</td>
            <td style="padding: 0.5rem;">${sale5SalePrice && sale5Gba ? calculatePricePerSF(sale5SalePrice, sale5Gba) : '-'}</td>
          </tr>
          ` : ''}
          ${sale6Name || sale6Address ? `
          <tr>
            <td style="padding: 0.5rem;">Sale 6</td>
            <td style="padding: 0.5rem;">${sale6Address || sale6Name || '-'}</td>
            <td style="padding: 0.5rem;">${sale6SaleDate || '-'}</td>
            <td style="padding: 0.5rem;">${sale6SalePrice ? formatCurrency(sale6SalePrice) : '-'}</td>
            <td style="padding: 0.5rem;">${sale6NumUnits || '-'}</td>
            <td style="padding: 0.5rem;">${sale6Gba ? `${Number(sale6Gba).toLocaleString()} SF` : '-'}</td>
            <td style="padding: 0.5rem;">${sale6SalePrice && sale6NumUnits ? calculatePricePerUnit(sale6SalePrice, sale6NumUnits) : '-'}</td>
            <td style="padding: 0.5rem;">${sale6SalePrice && sale6Gba ? calculatePricePerSF(sale6SalePrice, sale6Gba) : '-'}</td>
          </tr>
          ` : ''}
        </tbody>
      </table>
  
      <!-- PAGE BREAK - PAGE 7-8: Individual Comparable Cards -->
      <div style="page-break-before: always;"></div>
  
      <h3 class="subsection-title">Comparable Sales Analysis</h3>
  
      ${sale1Description || sale1Name ? `
        <div style="margin-bottom: 2rem; padding: 1rem; border: 1px solid #e5e7eb; border-radius: 0.5rem;">
          <h4 style="color: #1a365d; margin-bottom: 0.5rem;">Comparable Sale 1 - ${sale1Name || sale1Address}</h4>
          <p>${sale1Description || 'This property is located at ' + (sale1Address || 'address not specified') + ' and sold on ' + (sale1SaleDate || '[date not specified]') + ' for ' + (sale1SalePrice ? formatCurrency(sale1SalePrice) : '[price not specified]') + '. The property contains ' + (sale1NumUnits || '[number not specified]') + ' units with a gross building area of ' + (sale1Gba ? Number(sale1Gba).toLocaleString() + ' SF' : '[size not specified]') + '. This comparable is considered relevant to the subject property valuation due to its similar characteristics and recent transaction date.'}</p>
        </div>
      ` : ''}
  
      ${sale2Description || sale2Name ? `
        <div style="margin-bottom: 2rem; padding: 1rem; border: 1px solid #e5e7eb; border-radius: 0.5rem;">
          <h4 style="color: #1a365d; margin-bottom: 0.5rem;">Comparable Sale 2 - ${sale2Name || sale2Address}</h4>
          <p>${sale2Description || 'This property is located at ' + (sale2Address || 'address not specified') + ' and sold on ' + (sale2SaleDate || '[date not specified]') + ' for ' + (sale2SalePrice ? formatCurrency(sale2SalePrice) : '[price not specified]') + '. The property contains ' + (sale2NumUnits || '[number not specified]') + ' units with a gross building area of ' + (sale2Gba ? Number(sale2Gba).toLocaleString() + ' SF' : '[size not specified]') + '. This comparable is considered relevant to the subject property valuation due to its similar characteristics and recent transaction date.'}</p>
        </div>
      ` : ''}
  
      ${sale3Description || sale3Name ? `
        <div style="margin-bottom: 2rem; padding: 1rem; border: 1px solid #e5e7eb; border-radius: 0.5rem;">
          <h4 style="color: #1a365d; margin-bottom: 0.5rem;">Comparable Sale 3 - ${sale3Name || sale3Address}</h4>
          <p>${sale3Description || 'This property is located at ' + (sale3Address || 'address not specified') + ' and sold on ' + (sale3SaleDate || '[date not specified]') + ' for ' + (sale3SalePrice ? formatCurrency(sale3SalePrice) : '[price not specified]') + '. The property contains ' + (sale3NumUnits || '[number not specified]') + ' units with a gross building area of ' + (sale3Gba ? Number(sale3Gba).toLocaleString() + ' SF' : '[size not specified]') + '. This comparable is considered relevant to the subject property valuation due to its similar characteristics and recent transaction date.'}</p>
        </div>
      ` : ''}
  
      ${sale4Description || sale4Name ? `
        <div style="margin-bottom: 2rem; padding: 1rem; border: 1px solid #e5e7eb; border-radius: 0.5rem;">
          <h4 style="color: #1a365d; margin-bottom: 0.5rem;">Comparable Sale 4 - ${sale4Name || sale4Address}</h4>
          <p>${sale4Description || 'This property is located at ' + (sale4Address || 'address not specified') + ' and sold on ' + (sale4SaleDate || '[date not specified]') + ' for ' + (sale4SalePrice ? formatCurrency(sale4SalePrice) : '[price not specified]') + '. The property contains ' + (sale4NumUnits || '[number not specified]') + ' units with a gross building area of ' + (sale4Gba ? Number(sale4Gba).toLocaleString() + ' SF' : '[size not specified]') + '. This comparable is considered relevant to the subject property valuation due to its similar characteristics and recent transaction date.'}</p>
        </div>
      ` : ''}
  
      ${sale5Description || sale5Name ? `
        <div style="margin-bottom: 2rem; padding: 1rem; border: 1px solid #e5e7eb; border-radius: 0.5rem;">
          <h4 style="color: #1a365d; margin-bottom: 0.5rem;">Comparable Sale 5 - ${sale5Name || sale5Address}</h4>
          <p>${sale5Description || 'This property is located at ' + (sale5Address || 'address not specified') + ' and sold on ' + (sale5SaleDate || '[date not specified]') + ' for ' + (sale5SalePrice ? formatCurrency(sale5SalePrice) : '[price not specified]') + '. The property contains ' + (sale5NumUnits || '[number not specified]') + ' units with a gross building area of ' + (sale5Gba ? Number(sale5Gba).toLocaleString() + ' SF' : '[size not specified]') + '. This comparable is considered relevant to the subject property valuation due to its similar characteristics and recent transaction date.'}</p>
        </div>
      ` : ''}
  
      ${sale6Description || sale6Name ? `
        <div style="margin-bottom: 2rem; padding: 1rem; border: 1px solid #e5e7eb; border-radius: 0.5rem;">
          <h4 style="color: #1a365d; margin-bottom: 0.5rem;">Comparable Sale 6 - ${sale6Name || sale6Address}</h4>
          <p>${sale6Description || 'This property is located at ' + (sale6Address || 'address not specified') + ' and sold on ' + (sale6SaleDate || '[date not specified]') + ' for ' + (sale6SalePrice ? formatCurrency(sale6SalePrice) : '[price not specified]') + '. The property contains ' + (sale6NumUnits || '[number not specified]') + ' units with a gross building area of ' + (sale6Gba ? Number(sale6Gba).toLocaleString() + ' SF' : '[size not specified]') + '. This comparable is considered relevant to the subject property valuation due to its similar characteristics and recent transaction date.'}</p>
        </div>
      ` : ''}
  
      <!-- PAGE BREAK - PAGE 9: Adjustment Grid -->
      <div style="page-break-before: always;"></div>
  
      <h3 class="subsection-title">Adjustment Grid Analysis</h3>
      <div class="site-narrative-section" style="margin-bottom: 1rem;">
        <p class="site-narrative-text">
          The following adjustment grid provides a systematic analysis of how each comparable sale differs from the subject property. Adjustments are made to the sale prices of the comparables to account for these differences, bringing them to a common basis for comparison with the subject property.
        </p>
      </div>
  
      <table class="site-table" style="font-size: 0.75rem;">
        <thead>
          <tr style="background: #1a365d; color: white;">
            <th style="padding: 0.4rem;">Element</th>
            <th style="padding: 0.4rem;">Subject</th>
            <th style="padding: 0.4rem;">Sale 1</th>
            <th style="padding: 0.4rem;">Sale 2</th>
            <th style="padding: 0.4rem;">Sale 3</th>
            <th style="padding: 0.4rem;">Sale 4</th>
            <th style="padding: 0.4rem;">Sale 5</th>
            <th style="padding: 0.4rem;">Sale 6</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 0.4rem; font-weight: bold;">Sale Price</td>
            <td style="padding: 0.4rem;">-</td>
            <td style="padding: 0.4rem;">${sale1SalePrice ? formatCurrency(sale1SalePrice) : '-'}</td>
            <td style="padding: 0.4rem;">${sale2SalePrice ? formatCurrency(sale2SalePrice) : '-'}</td>
            <td style="padding: 0.4rem;">${sale3SalePrice ? formatCurrency(sale3SalePrice) : '-'}</td>
            <td style="padding: 0.4rem;">${sale4SalePrice ? formatCurrency(sale4SalePrice) : '-'}</td>
            <td style="padding: 0.4rem;">${sale5SalePrice ? formatCurrency(sale5SalePrice) : '-'}</td>
            <td style="padding: 0.4rem;">${sale6SalePrice ? formatCurrency(sale6SalePrice) : '-'}</td>
          </tr>
          <tr style="background: #f9fafb;">
            <td colspan="8" style="padding: 0.4rem; font-weight: bold;">ADJUSTMENTS</td>
          </tr>
          <tr>
            <td style="padding: 0.4rem;">Property Rights</td>
            <td style="padding: 0.4rem;">Fee Simple</td>
            <td style="padding: 0.4rem;">${formatAdjustment(sale1AdjPropertyRights)}</td>
            <td style="padding: 0.4rem;">${formatAdjustment(sale2AdjPropertyRights)}</td>
            <td style="padding: 0.4rem;">${formatAdjustment(sale3AdjPropertyRights)}</td>
            <td style="padding: 0.4rem;">${formatAdjustment(sale4AdjPropertyRights)}</td>
            <td style="padding: 0.4rem;">${formatAdjustment(sale5AdjPropertyRights)}</td>
            <td style="padding: 0.4rem;">${formatAdjustment(sale6AdjPropertyRights)}</td>
          </tr>
          <tr>
            <td style="padding: 0.4rem;">Financing Terms</td>
            <td style="padding: 0.4rem;">Cash Equiv.</td>
            <td style="padding: 0.4rem;">${formatAdjustment(sale1AdjFinancing)}</td>
            <td style="padding: 0.4rem;">${formatAdjustment(sale2AdjFinancing)}</td>
            <td style="padding: 0.4rem;">${formatAdjustment(sale3AdjFinancing)}</td>
            <td style="padding: 0.4rem;">${formatAdjustment(sale4AdjFinancing)}</td>
            <td style="padding: 0.4rem;">${formatAdjustment(sale5AdjFinancing)}</td>
            <td style="padding: 0.4rem;">${formatAdjustment(sale6AdjFinancing)}</td>
          </tr>
          <tr>
            <td style="padding: 0.4rem;">Conditions of Sale</td>
            <td style="padding: 0.4rem;">Arms Length</td>
            <td style="padding: 0.4rem;">${formatAdjustment(sale1AdjConditionsSale)}</td>
            <td style="padding: 0.4rem;">${formatAdjustment(sale2AdjConditionsSale)}</td>
            <td style="padding: 0.4rem;">${formatAdjustment(sale3AdjConditionsSale)}</td>
            <td style="padding: 0.4rem;">${formatAdjustment(sale4AdjConditionsSale)}</td>
            <td style="padding: 0.4rem;">${formatAdjustment(sale5AdjConditionsSale)}</td>
            <td style="padding: 0.4rem;">${formatAdjustment(sale6AdjConditionsSale)}</td>
          </tr>
          <tr>
            <td style="padding: 0.4rem;">Market Conditions (Time)</td>
            <td style="padding: 0.4rem;">Current</td>
            <td style="padding: 0.4rem;">${formatAdjustment(sale1AdjMarketTime)}</td>
            <td style="padding: 0.4rem;">${formatAdjustment(sale2AdjMarketTime)}</td>
            <td style="padding: 0.4rem;">${formatAdjustment(sale3AdjMarketTime)}</td>
            <td style="padding: 0.4rem;">${formatAdjustment(sale4AdjMarketTime)}</td>
            <td style="padding: 0.4rem;">${formatAdjustment(sale5AdjMarketTime)}</td>
            <td style="padding: 0.4rem;">${formatAdjustment(sale6AdjMarketTime)}</td>
          </tr>
          <tr>
            <td style="padding: 0.4rem;">Location</td>
            <td style="padding: 0.4rem;">-</td>
            <td style="padding: 0.4rem;">${formatAdjustment(sale1AdjLocation)}</td>
            <td style="padding: 0.4rem;">${formatAdjustment(sale2AdjLocation)}</td>
            <td style="padding: 0.4rem;">${formatAdjustment(sale3AdjLocation)}</td>
            <td style="padding: 0.4rem;">${formatAdjustment(sale4AdjLocation)}</td>
            <td style="padding: 0.4rem;">${formatAdjustment(sale5AdjLocation)}</td>
            <td style="padding: 0.4rem;">${formatAdjustment(sale6AdjLocation)}</td>
          </tr>
          <tr>
            <td style="padding: 0.4rem;">Size (Units)</td>
            <td style="padding: 0.4rem;">${subjectNumUnits || '-'}</td>
            <td style="padding: 0.4rem;">${sale1NumUnits || '-'}</td>
            <td style="padding: 0.4rem;">${sale2NumUnits || '-'}</td>
            <td style="padding: 0.4rem;">${sale3NumUnits || '-'}</td>
            <td style="padding: 0.4rem;">${sale4NumUnits || '-'}</td>
            <td style="padding: 0.4rem;">${sale5NumUnits || '-'}</td>
            <td style="padding: 0.4rem;">${sale6NumUnits || '-'}</td>
          </tr>
          <tr>
            <td style="padding: 0.4rem;">Size Adjustment</td>
            <td style="padding: 0.4rem;">-</td>
            <td style="padding: 0.4rem;">${formatAdjustment(sale1AdjSize)}</td>
            <td style="padding: 0.4rem;">${formatAdjustment(sale2AdjSize)}</td>
            <td style="padding: 0.4rem;">${formatAdjustment(sale3AdjSize)}</td>
            <td style="padding: 0.4rem;">${formatAdjustment(sale4AdjSize)}</td>
            <td style="padding: 0.4rem;">${formatAdjustment(sale5AdjSize)}</td>
            <td style="padding: 0.4rem;">${formatAdjustment(sale6AdjSize)}</td>
          </tr>
          <tr>
            <td style="padding: 0.4rem;">Age/Condition Adjustment</td>
            <td style="padding: 0.4rem;">${subjectYearBuilt || '-'}/${subjectCondition || '-'}</td>
            <td style="padding: 0.4rem;">${formatAdjustment(sale1AdjAgeCondition)}</td>
            <td style="padding: 0.4rem;">${formatAdjustment(sale2AdjAgeCondition)}</td>
            <td style="padding: 0.4rem;">${formatAdjustment(sale3AdjAgeCondition)}</td>
            <td style="padding: 0.4rem;">${formatAdjustment(sale4AdjAgeCondition)}</td>
            <td style="padding: 0.4rem;">${formatAdjustment(sale5AdjAgeCondition)}</td>
            <td style="padding: 0.4rem;">${formatAdjustment(sale6AdjAgeCondition)}</td>
          </tr>
          <tr>
            <td style="padding: 0.4rem;">Other Adjustments</td>
            <td style="padding: 0.4rem;">-</td>
            <td style="padding: 0.4rem;">${formatAdjustment(sale1AdjOther)}</td>
            <td style="padding: 0.4rem;">${formatAdjustment(sale2AdjOther)}</td>
            <td style="padding: 0.4rem;">${formatAdjustment(sale3AdjOther)}</td>
            <td style="padding: 0.4rem;">${formatAdjustment(sale4AdjOther)}</td>
            <td style="padding: 0.4rem;">${formatAdjustment(sale5AdjOther)}</td>
            <td style="padding: 0.4rem;">${formatAdjustment(sale6AdjOther)}</td>
          </tr>
          <tr style="background: #f9fafb; font-weight: bold;">
            <td style="padding: 0.4rem;">Net Adjustment</td>
            <td style="padding: 0.4rem;">-</td>
            <td style="padding: 0.4rem;">${sale1NetAdj > 0 ? '+' : ''}${sale1NetAdj.toFixed(1)}%</td>
            <td style="padding: 0.4rem;">${sale2NetAdj > 0 ? '+' : ''}${sale2NetAdj.toFixed(1)}%</td>
            <td style="padding: 0.4rem;">${sale3NetAdj > 0 ? '+' : ''}${sale3NetAdj.toFixed(1)}%</td>
            <td style="padding: 0.4rem;">${sale4NetAdj > 0 ? '+' : ''}${sale4NetAdj.toFixed(1)}%</td>
            <td style="padding: 0.4rem;">${sale5NetAdj > 0 ? '+' : ''}${sale5NetAdj.toFixed(1)}%</td>
            <td style="padding: 0.4rem;">${sale6NetAdj > 0 ? '+' : ''}${sale6NetAdj.toFixed(1)}%</td>
          </tr>
          <tr style="background: #1a365d; color: white; font-weight: bold;">
            <td style="padding: 0.4rem;">Adjusted Price</td>
            <td style="padding: 0.4rem;">-</td>
            <td style="padding: 0.4rem;">${sale1AdjustedPrice}</td>
            <td style="padding: 0.4rem;">${sale2AdjustedPrice}</td>
            <td style="padding: 0.4rem;">${sale3AdjustedPrice}</td>
            <td style="padding: 0.4rem;">${sale4AdjustedPrice}</td>
            <td style="padding: 0.4rem;">${sale5AdjustedPrice}</td>
            <td style="padding: 0.4rem;">${sale6AdjustedPrice}</td>
          </tr>
        </tbody>
      </table>
  
      <div class="site-narrative-section" style="margin-top: 1rem;">
        <p class="site-narrative-text" style="font-size: 0.85rem; font-style: italic;">
          Note: Specific adjustment percentages and amounts should be filled in based on market analysis and appraiser judgment. The adjustment grid above provides the framework for systematic comparison.
        </p>
      </div>
  
      <!-- PAGE BREAK - PAGE 10: Adjustment Summary -->
      <div style="page-break-before: always;"></div>
  
      ${adjustmentSummary ? `
        <h3 class="subsection-title">Adjustment Summary</h3>
        <div class="site-narrative-section">
          <p class="site-narrative-text">${adjustmentSummary}</p>
        </div>
      ` : `
        <h3 class="subsection-title">Adjustment Summary</h3>
        <div class="site-narrative-section">
          <p class="site-narrative-text">
            The comparable sales required adjustments for various factors to make them more comparable to the subject property. The primary adjustments considered include:
          </p>
          <ul style="margin-left: 1.5rem; margin-top: 0.5rem;">
            <li><strong>Property Rights:</strong> All comparables sold with fee simple interest, requiring no adjustment.</li>
            <li><strong>Financing Terms:</strong> All sales were verified as arms-length transactions with conventional financing or cash, requiring no adjustment.</li>
            <li><strong>Conditions of Sale:</strong> All transactions were verified as arms-length sales between unrelated parties under normal market conditions.</li>
            <li><strong>Market Conditions:</strong> Adjustments for time were considered based on market trend analysis in the local multifamily market.</li>
            <li><strong>Location:</strong> Adjustments were made for differences in neighborhood quality, access to amenities, and overall desirability.</li>
            <li><strong>Size:</strong> Adjustments were considered for differences in unit count and gross building area.</li>
            <li><strong>Age and Condition:</strong> Adjustments were made based on effective age and overall condition of the improvements.</li>
          </ul>
        </div>
      `}
  
      <!-- PAGE BREAK - PAGE 11: Sales Reconciliation -->
      <div style="page-break-before: always;"></div>
  
      <h3 class="subsection-title">Sales Comparison Reconciliation</h3>
      <div class="site-narrative-section">
        ${salesReconciliation ? `
          <p class="site-narrative-text">${salesReconciliation}</p>
        ` : `
          <p class="site-narrative-text">
            Based on the analysis of the six comparable sales, the following reconciliation is presented. Each comparable was analyzed for its degree of similarity to the subject property, with consideration given to the quantity and quality of adjustments required.
          </p>
          <p class="site-narrative-text" style="margin-top: 1rem;">
            The comparable sales indicate a range of values for properties similar to the subject. After applying appropriate adjustments for differences in property characteristics, the adjusted sale prices provide a reasonable indication of the subject property's market value. Greater weight was given to comparables requiring fewer and smaller adjustments, as these represent more reliable indicators of value.
          </p>
          <p class="site-narrative-text" style="margin-top: 1rem;">
            The sales comparison approach provides strong support for the concluded value, as the market for multifamily properties in this area is active with sufficient comparable sales data to develop a reliable indication of value.
          </p>
        `}
      </div>
  
      <!-- Sales Comparison Value Conclusion -->
      <h3 class="subsection-title" style="margin-top: 1.5rem;">Sales Comparison Value Conclusion</h3>
      <table class="cap-value-table">
        <tbody>
          <tr class="cap-value-total">
            <td class="cap-table-label"><strong>Indicated Value - Sales Comparison Approach</strong></td>
            <td class="cap-table-value"><strong>${salesValueIndication ? formatCurrency(salesValueIndication) : '<span class="empty-state">—</span>'}</strong></td>
          </tr>
        </tbody>
      </table>
  
      ${!subjectNumUnits && !sale1Name && !sale2Name && !sale3Name && !sale4Name && !sale5Name && !sale6Name ? `
        <div class="empty-state-block">[Provide sales comparison data]</div>
      ` : ''}
    </div>
    `;
  };


  // Helper function to render the IMPV (Improvements) section with custom template
  const renderImpvSection = (section: ReportSection): string => {
    // SECTION 1: Overview & General Description
    const impvOverview = getFieldValue(section, 'impv-overview');

    // SECTION 2: Building Description Table (Detailed Specs)
    const numberOfBuildings = getFieldValue(section, 'impv-num-buildings');
    const numberOfStories = getFieldValue(section, 'impv-num-stories');
    const yearBuiltImpv = getFieldValue(section, 'impv-year-built');
    const buildingFormatImpv = getFieldValue(section, 'impv-building-format');
    const netRentableArea = getFieldValue(section, 'impv-nra');
    const totalUnitsImpv = getFieldValue(section, 'impv-num-units');
    const occupancyRate = getFieldValue(section, 'impv-occupancy-rate');
    const buildingFootprint = getFieldValue(section, 'impv-building-footprint');

    // Construction details
    const foundation = getFieldValue(section, 'impv-foundation');
    const exteriorWalls = getFieldValue(section, 'impv-exterior-walls');
    const roofType = getFieldValue(section, 'impv-roof');
    const roofCondition = getFieldValue(section, 'impv-roof-condition');
    const elevator = getFieldValue(section, 'impv-elevator');

    // SECTION 3: Interior Finish
    const interiorWalls = getFieldValue(section, 'impv-interior-walls');
    const ceilings = getFieldValue(section, 'impv-ceilings');
    const flooring = getFieldValue(section, 'impv-flooring');
    const doorsWindows = getFieldValue(section, 'impv-doors-windows');
    const interiorFinish = getFieldValue(section, 'impv-interior-finish');

    // Building Systems
    const hvac = getFieldValue(section, 'impv-hvac');
    const electrical = getFieldValue(section, 'impv-electrical');
    const plumbing = getFieldValue(section, 'impv-plumbing');
    const insulation = getFieldValue(section, 'impv-insulation');
    const fireProtection = getFieldValue(section, 'impv-fire-protection');

    // SECTION 4: Building Quality & Condition
    const overallCondition = getFieldValue(section, 'impv-overall-condition');

    // SECTION 5: Site Improvements & Amenities
    const projectAmenities = getFieldValue(section, 'impv-project-amenities');
    const unitAmenities = getFieldValue(section, 'impv-unit-amenities');
    const laundry = getFieldValue(section, 'impv-laundry');
    const security = getFieldValue(section, 'impv-security');
    const siteImprovements = getFieldValue(section, 'impv-site-improvements');
    const landscaping = getFieldValue(section, 'impv-landscaping');
    const parkingSpaces = getFieldValue(section, 'impv-parking-spaces');
    const parkingRatio = getFieldValue(section, 'impv-parking-ratio');
    const siteCoverage = getFieldValue(section, 'impv-site-coverage');

    // SECTION 6: Deferred Maintenance & Obsolescence
    const functionalDesign = getFieldValue(section, 'impv-functional-design');
    const hazardousMaterials = getFieldValue(section, 'impv-hazardous-materials');

    // Calculate effective age if year built is provided
    const currentYear = new Date().getFullYear();
    const effectiveAge = yearBuiltImpv ? currentYear - parseInt(yearBuiltImpv) : null;

    // Validation flags for sections
    const hasOverview = impvOverview;
    const hasBuildingDescription = numberOfBuildings || numberOfStories || yearBuiltImpv || foundation || exteriorWalls || roofType || netRentableArea || totalUnitsImpv;
    const hasInteriorFinish = interiorWalls || ceilings || flooring || doorsWindows || interiorFinish || hvac || electrical || plumbing || insulation;
    const hasCondition = overallCondition;
    const hasSiteImprovements = projectAmenities || unitAmenities || siteImprovements || landscaping || parkingSpaces;
    const hasFunctionalObsolescence = functionalDesign || hazardousMaterials;

    return `
  <div class="section">
    <h2 class="section-title">Description of the Improvements</h2>

    <!-- Introductory Paragraph -->
    <div class="site-narrative-section" style="margin-bottom: 1.5rem;">
      <p class="site-narrative-text" style="font-style: italic;">
        The information presented below is a basic description of the existing improvements that are used in the valuation of the property.
        Reliance is placed on information provided by sources deemed dependable for this analysis. It is assumed that there are no hidden
        defects, and that all structural components are functional and operational, unless otherwise noted. If questions arise regarding
        the integrity of the improvements or their operational components, it may be necessary to consult additional professional resources.
        The sizes are based on the information provided by the client and from public sources.
      </p>
    </div>

    ${hasOverview ? `
      <!-- SECTION 1: Improvements Overview (0.5 page) -->
      <h3 class="subsection-title">Overview</h3>
      <div class="site-narrative-section" style="margin-bottom: 2rem;">
        <p class="site-narrative-text">${impvOverview}</p>
      </div>
    ` : ''}

    ${hasBuildingDescription ? `
      <!-- PAGE BREAK BEFORE BUILDING DESCRIPTION TABLE -->
      <div style="page-break-before: always;"></div>

      <!-- SECTION 2: Building Description Table (1 page) -->
      <h3 class="subsection-title">Building Description</h3>
      <table class="site-table" style="margin-bottom: 2rem;">
        <thead>
          <tr>
            <th class="site-table-label" style="background-color: #f5f5f5; font-weight: bold; width: 40%;">COMPONENT</th>
            <th class="site-table-value" style="background-color: #f5f5f5; font-weight: bold;">DESCRIPTION</th>
          </tr>
        </thead>
        <tbody>
          ${projectAmenities ? `
            <tr>
              <td class="site-table-label">Project Amenities</td>
              <td class="site-table-value">${projectAmenities}</td>
            </tr>
          ` : ''}
          ${unitAmenities ? `
            <tr>
              <td class="site-table-label">Unit Amenities</td>
              <td class="site-table-value">${unitAmenities}</td>
            </tr>
          ` : ''}
          ${laundry ? `
            <tr>
              <td class="site-table-label">Laundry</td>
              <td class="site-table-value">${laundry}</td>
            </tr>
          ` : ''}
          ${security ? `
            <tr>
              <td class="site-table-label">Security Features</td>
              <td class="site-table-value">${security}</td>
            </tr>
          ` : ''}
          ${foundation ? `
            <tr>
              <td class="site-table-label">Foundation</td>
              <td class="site-table-value">${foundation}</td>
            </tr>
          ` : ''}
          ${exteriorWalls ? `
            <tr>
              <td class="site-table-label">Exterior Walls/Framing</td>
              <td class="site-table-value">${exteriorWalls}</td>
            </tr>
          ` : ''}
          ${roofType ? `
            <tr>
              <td class="site-table-label">Roof</td>
              <td class="site-table-value">${roofType}${roofCondition ? '; ' + roofCondition : ''}</td>
            </tr>
          ` : ''}
          ${elevator ? `
            <tr>
              <td class="site-table-label">Elevator</td>
              <td class="site-table-value">${elevator}</td>
            </tr>
          ` : ''}
          ${hvac ? `
            <tr>
              <td class="site-table-label">Heating & AC (HVAC)</td>
              <td class="site-table-value">${hvac}</td>
            </tr>
          ` : ''}
          ${insulation ? `
            <tr>
              <td class="site-table-label">Insulation</td>
              <td class="site-table-value">${insulation}</td>
            </tr>
          ` : ''}
          ${electrical ? `
            <tr>
              <td class="site-table-label">Electrical</td>
              <td class="site-table-value">${electrical}</td>
            </tr>
          ` : ''}
          ${interiorWalls ? `
            <tr>
              <td class="site-table-label">Interior Walls</td>
              <td class="site-table-value">${interiorWalls}</td>
            </tr>
          ` : ''}
          ${doorsWindows ? `
            <tr>
              <td class="site-table-label">Doors and Windows</td>
              <td class="site-table-value">${doorsWindows}</td>
            </tr>
          ` : ''}
          ${ceilings ? `
            <tr>
              <td class="site-table-label">Ceilings</td>
              <td class="site-table-value">${ceilings}</td>
            </tr>
          ` : ''}
          ${plumbing ? `
            <tr>
              <td class="site-table-label">Plumbing</td>
              <td class="site-table-value">${plumbing}</td>
            </tr>
          ` : ''}
          ${flooring ? `
            <tr>
              <td class="site-table-label">Floor Covering</td>
              <td class="site-table-value">${flooring}</td>
            </tr>
          ` : ''}
          ${fireProtection ? `
            <tr>
              <td class="site-table-label">Fire Protection</td>
              <td class="site-table-value">${fireProtection}</td>
            </tr>
          ` : ''}
          ${interiorFinish ? `
            <tr>
              <td class="site-table-label">Interior Finish/Build-Out</td>
              <td class="site-table-value">${interiorFinish}</td>
            </tr>
          ` : ''}
          ${siteImprovements ? `
            <tr>
              <td class="site-table-label">Site Improvements</td>
              <td class="site-table-value">${siteImprovements}</td>
            </tr>
          ` : ''}
          ${landscaping ? `
            <tr>
              <td class="site-table-label">Landscaping</td>
              <td class="site-table-value">${landscaping}</td>
            </tr>
          ` : ''}
          ${parkingSpaces ? `
            <tr>
              <td class="site-table-label">Parking</td>
              <td class="site-table-value">The subject provides ${parkingSpaces} parking spaces${parkingRatio ? ' and is therefore conforming to zoning requirements. The parking ratio of ' + parkingRatio + ' per unit is within the typical range of spaces per unit and within zoning requirements.' : '.'}</td>
            </tr>
          ` : ''}
          ${siteCoverage ? `
            <tr>
              <td class="site-table-label">Site Coverage Ratio</td>
              <td class="site-table-value">${siteCoverage}%${buildingFootprint ? ' (' + Number(buildingFootprint).toLocaleString() + ' SF footprint)' : ''}, which is within market standards (20-35%) for similar walkup buildings in the area.</td>
            </tr>
          ` : ''}
          ${functionalDesign ? `
            <tr>
              <td class="site-table-label">Functional Design</td>
              <td class="site-table-value">${functionalDesign}</td>
            </tr>
          ` : ''}
          ${hazardousMaterials ? `
            <tr>
              <td class="site-table-label">Hazardous Materials</td>
              <td class="site-table-value">${hazardousMaterials}</td>
            </tr>
          ` : ''}
        </tbody>
      </table>
    ` : ''}

    ${hasInteriorFinish ? `
      <!-- SECTION 3: Interior Finish (1 page) -->
      <div style="page-break-before: always;"></div>

      <h3 class="subsection-title">Interior Finish & Building Systems</h3>
      <div class="site-narrative-section" style="margin-bottom: 2rem;">
        <h4 class="site-narrative-label">Unit Interiors</h4>
        ${flooring ? `<p class="site-narrative-text"><strong>Flooring:</strong> ${flooring}</p>` : ''}
        ${interiorWalls ? `<p class="site-narrative-text"><strong>Walls:</strong> ${interiorWalls}</p>` : ''}
        ${ceilings ? `<p class="site-narrative-text"><strong>Ceilings:</strong> ${ceilings}</p>` : ''}
        ${doorsWindows ? `<p class="site-narrative-text"><strong>Doors & Windows:</strong> ${doorsWindows}</p>` : ''}
        ${interiorFinish ? `<p class="site-narrative-text"><strong>Overall Finish Quality:</strong> ${interiorFinish}</p>` : ''}

        <h4 class="site-narrative-label" style="margin-top: 1.5rem;">Building Systems</h4>
        ${hvac ? `<p class="site-narrative-text"><strong>HVAC System:</strong> ${hvac}</p>` : ''}
        ${electrical ? `<p class="site-narrative-text"><strong>Electrical:</strong> ${electrical}</p>` : ''}
        ${plumbing ? `<p class="site-narrative-text"><strong>Plumbing:</strong> ${plumbing}</p>` : ''}
        ${insulation ? `<p class="site-narrative-text"><strong>Insulation:</strong> ${insulation}</p>` : ''}
        ${fireProtection ? `<p class="site-narrative-text"><strong>Fire Protection:</strong> ${fireProtection}</p>` : ''}
      </div>
    ` : ''}

    ${hasCondition ? `
      <!-- SECTION 4: Building Quality & Condition (1 page) -->
      <div style="page-break-before: always;"></div>

      <h3 class="subsection-title">Building Quality & Condition</h3>
      <div class="site-narrative-section" style="margin-bottom: 2rem;">
        <table class="site-table" style="margin-bottom: 1.5rem;">
          <tbody>
            ${yearBuiltImpv ? `
              <tr>
                <td class="site-table-label">Year Built</td>
                <td class="site-table-value">${yearBuiltImpv}</td>
              </tr>
            ` : ''}
            ${effectiveAge !== null ? `
              <tr>
                <td class="site-table-label">Effective Age</td>
                <td class="site-table-value">${effectiveAge} years</td>
              </tr>
            ` : ''}
            ${overallCondition ? `
              <tr>
                <td class="site-table-label">Overall Condition</td>
                <td class="site-table-value">${overallCondition}</td>
              </tr>
            ` : ''}
            ${buildingFormatImpv ? `
              <tr>
                <td class="site-table-label">Building Format</td>
                <td class="site-table-value">${buildingFormatImpv}</td>
              </tr>
            ` : ''}
            ${numberOfStories ? `
              <tr>
                <td class="site-table-label">Stories</td>
                <td class="site-table-value">${numberOfStories}</td>
              </tr>
            ` : ''}
            ${totalUnitsImpv ? `
              <tr>
                <td class="site-table-label">Total Units</td>
                <td class="site-table-value">${totalUnitsImpv}</td>
              </tr>
            ` : ''}
            ${netRentableArea ? `
              <tr>
                <td class="site-table-label">Gross Building Area (GBA)</td>
                <td class="site-table-value">${Number(netRentableArea).toLocaleString()} SF</td>
              </tr>
            ` : ''}
            ${netRentableArea ? `
              <tr>
                <td class="site-table-label">Net Rentable Area (NRA)</td>
                <td class="site-table-value">${Number(netRentableArea).toLocaleString()} SF</td>
              </tr>
            ` : ''}
          </tbody>
        </table>

        <h4 class="site-narrative-label">Condition Assessment</h4>
        <p class="site-narrative-text">
          The property, reportedly built in ${yearBuiltImpv || '[Year]'}, is approximately ${effectiveAge !== null ? effectiveAge : '[Age]'} years old
          and features ${totalUnitsImpv || '[Number]'} units in a ${numberOfStories || '[Stories]'}-story, ${buildingFormatImpv || 'garden style'} format.
          The overall condition is assessed as ${overallCondition || 'average'} based on the physical inspection conducted as part of this appraisal.
        </p>
      </div>
    ` : ''}

    ${hasSiteImprovements ? `
      <!-- SECTION 5: Site Improvements (0.5 page) -->
      <h3 class="subsection-title" style="margin-top: 2rem;">Site Improvements & Amenities</h3>
      <div class="site-narrative-section" style="margin-bottom: 2rem;">
        ${siteImprovements ? `
          <h4 class="site-narrative-label">Site Features</h4>
          <p class="site-narrative-text">${siteImprovements}</p>
        ` : ''}

        ${landscaping ? `
          <h4 class="site-narrative-label">Landscaping</h4>
          <p class="site-narrative-text">${landscaping}</p>
        ` : ''}

        ${parkingSpaces ? `
          <h4 class="site-narrative-label">Parking</h4>
          <p class="site-narrative-text">
            The subject provides ${parkingSpaces} parking spaces${parkingRatio ? '. The parking ratio of ' + parkingRatio + ' spaces per unit is within the typical range and complies with zoning requirements.' : '.'}
          </p>
        ` : ''}

        ${projectAmenities ? `
          <h4 class="site-narrative-label">Project Amenities</h4>
          <p class="site-narrative-text">${projectAmenities}</p>
        ` : ''}
      </div>
    ` : ''}

    ${hasFunctionalObsolescence ? `
      <!-- SECTION 6: Functional/External Obsolescence (0.5 page) -->
      <h3 class="subsection-title" style="margin-top: 2rem;">Functional Design & Obsolescence</h3>
      <div class="site-narrative-section" style="margin-bottom: 2rem;">
        ${functionalDesign ? `
          <h4 class="site-narrative-label">Functional Design Assessment</h4>
          <p class="site-narrative-text">${functionalDesign}</p>
        ` : ''}

        <h4 class="site-narrative-label">Deferred Maintenance</h4>
        <p class="site-narrative-text">
          Based on the physical inspection and information provided, there are ${overallCondition === 'Good' || overallCondition === 'Excellent' ? 'minimal' : 'some'}
          items of deferred maintenance noted. The property appears to be adequately maintained for its age and class.
        </p>

        ${hazardousMaterials ? `
          <h4 class="site-narrative-label">Hazardous Materials</h4>
          <p class="site-narrative-text">${hazardousMaterials}</p>
        ` : `
          <h4 class="site-narrative-label">Hazardous Materials</h4>
          <p class="site-narrative-text">
            A Phase I environmental report was not provided. This appraisal assumes that the improvements are constructed free of all
            hazardous waste and toxic materials, including (but not limited to) unseen asbestos and mold. Please refer to the
            Assumptions and Limiting Conditions section regarding this issue.
          </p>
        `}
      </div>
    ` : ''}

    ${!hasOverview && !hasBuildingDescription && !hasInteriorFinish && !hasCondition && !hasSiteImprovements && !hasFunctionalObsolescence ? `
      <div class="empty-state-block">[Provide improvements details]</div>
    ` : ''}
  </div>
  `;
  };


  // Helper function to render the REPORT INFORMATION section
  // This is a simple section with just 4 fields from the store definition
  const renderReportSection = (section: ReportSection): string => {
    // Get only the 4 fields defined in the store for "report" section
    const reportType = getFieldValue(section, 'report-type');
    const reportPurpose = getFieldValue(section, 'report-purpose');
    const reportScope = getFieldValue(section, 'report-scope');
    const reportCompliance = getFieldValue(section, 'report-compliance');

    const hasContent = reportType || reportPurpose || reportScope || reportCompliance;

    return `
    <div class="section">
      <h2 class="section-title">Report Information</h2>

      ${hasContent ? `
        <table class="site-table">
          <tbody>
            ${reportType ? `
              <tr>
                <td class="site-table-label">Report Type</td>
                <td class="site-table-value">${reportType}</td>
              </tr>
            ` : ''}
            ${reportCompliance ? `
              <tr>
                <td class="site-table-label">Compliance Standard</td>
                <td class="site-table-value">${reportCompliance}</td>
              </tr>
            ` : ''}
          </tbody>
        </table>

        ${reportPurpose ? `
          <div class="site-narrative-section" style="margin-top: 1rem;">
            <h4 class="site-narrative-label">Purpose</h4>
            <p class="site-narrative-text">${reportPurpose}</p>
          </div>
        ` : ''}

        ${reportScope ? `
          <div class="site-narrative-section" style="margin-top: 1rem;">
            <h4 class="site-narrative-label">Scope of Work</h4>
            <p class="site-narrative-text">${reportScope}</p>
          </div>
        ` : ''}
      ` : `
        <div class="empty-state-block">[Provide report details]</div>
      `}
    </div>
    `;
  };

  // Helper function to render the PHOTOS section with custom 2-column grid template
  // Now reads from image-mgt section (single source of truth for all images)
  const renderPhotosSection = (_section: ReportSection): string => {
    // Photo subsections mapping: subsection ID -> display title
    const photoSubsections = [
      { id: 'exterior-photos', title: 'EXTERIOR PHOTOGRAPHS' },
      { id: 'street-photos', title: 'STREET VIEW PHOTOGRAPHS' },
      { id: 'common-photos', title: 'INTERIOR COMMON AREA' },
      { id: 'unit-photos', title: 'UNIT INTERIOR PHOTOGRAPHS' },
      { id: 'systems-photos', title: 'BUILDING SYSTEMS' },
    ];

    // Check if image-mgt section has any photos
    if (!imageMgtSection || !imageMgtSection.subsections) {
      return `
    <div class="section">
      <h2 class="section-title">Photos</h2>
      <div class="empty-state-block">[Add photos in S3 IMAGE MGT section]</div>
    </div>
      `;
    }

    let photosHtml = `
    <div class="section">
      <h2 class="section-title">Photos</h2>
    `;

    let hasAnyPhotos = false;

    // Process each photo subsection from image-mgt
    photoSubsections.forEach(({ id: subsectionId, title: subsectionTitle }) => {
      const subsection = imageMgtSection.subsections?.find(s => s.id === subsectionId);
      if (!subsection || !subsection.fields || subsection.fields.length === 0) return;

      // Extract photo fields and their captions
      const photoData: Array<{ imageUrl: string | null; caption: string }> = [];

      // Group fields by their base name (e.g., 'img-exterior-1' and 'img-exterior-1-caption')
      const fieldMap = new Map<string, { imageUrl: string | null; caption: string }>();

      subsection.fields.forEach(field => {
        if (field.type === 'image') {
          // This is an image field - handle both string and array values
          let imageUrl: string | null = null;
          if (typeof field.value === 'string' && field.value) {
            imageUrl = field.value;
          } else if (Array.isArray(field.value) && field.value.length > 0) {
            imageUrl = field.value[0] as string;
          }
          const baseId = field.id;

          if (!fieldMap.has(baseId)) {
            fieldMap.set(baseId, { imageUrl, caption: '' });
          } else {
            const existing = fieldMap.get(baseId)!;
            existing.imageUrl = imageUrl;
          }
        } else if (field.id.endsWith('-caption')) {
          // This is a caption field
          const baseId = field.id.replace('-caption', '');
          const caption = String(field.value || '');

          if (!fieldMap.has(baseId)) {
            fieldMap.set(baseId, { imageUrl: null, caption });
          } else {
            const existing = fieldMap.get(baseId)!;
            existing.caption = caption;
          }
        }
      });

      // Convert map to array (only include entries with images)
      fieldMap.forEach(data => {
        if (data.imageUrl) {
          photoData.push(data);
        }
      });

      if (photoData.length === 0) return;

      hasAnyPhotos = true;

      // Add subsection title
      photosHtml += `
      <h3 class="subsection-title">${subsectionTitle}</h3>
      <table class="photo-grid">
      `;

      // Render photos in 2-column grid with page breaks every 2 rows (4 photos per page)
      const PHOTOS_PER_PAGE = 4; // 2 rows x 2 columns
      let photoCount = 0;

      for (let i = 0; i < photoData.length; i += 2) {
        photosHtml += `
        <tr>
          <td class="photo-cell">
            <img src="${photoData[i].imageUrl}" alt="Photo ${i + 1}" class="photo-image" />
            ${photoData[i].caption ? `<div class="photo-caption">${photoData[i].caption}</div>` : ''}
          </td>
        `;

        if (i + 1 < photoData.length) {
          photosHtml += `
          <td class="photo-cell">
            <img src="${photoData[i + 1].imageUrl}" alt="Photo ${i + 2}" class="photo-image" />
            ${photoData[i + 1].caption ? `<div class="photo-caption">${photoData[i + 1].caption}</div>` : ''}
          </td>
          `;
          photoCount += 2;
        } else {
          // Odd number of photos - leave second cell empty
          photosHtml += `
          <td class="photo-cell"></td>
          `;
          photoCount += 1;
        }

        photosHtml += `
        </tr>
        `;

        // Add page break after every 4 photos (2 rows), but not after the last row
        if (photoCount >= PHOTOS_PER_PAGE && i + 2 < photoData.length) {
          photosHtml += `
      </table>
      <div style="page-break-before: always;"></div>
      <h3 class="subsection-title">${subsectionTitle} (continued)</h3>
      <table class="photo-grid">
          `;
          photoCount = 0;
        }
      }

      photosHtml += `
      </table>
      `;
    });

    // If no photos found at all, show empty state
    if (!hasAnyPhotos) {
      return `
    <div class="section">
      <h2 class="section-title">Photos</h2>
      <div class="empty-state-block">[Add photos in S3 IMAGE MGT section]</div>
    </div>
      `;
    }

    photosHtml += `
    </div>
    `;

    return photosHtml;
  };

  // Helper function to render the CERTIFICATION section
  const renderCertificationSection = (): string => {
    // Get current date for the certification
    const certDate = reportDate || new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return `
    <div class="section">
      <h2 class="section-title">Certification</h2>

      <div class="site-narrative-section">
        <p class="site-narrative-text">I certify that, to the best of my knowledge and belief:</p>
      </div>

      <div class="cert-statement">
        <div class="cert-number">1.</div>
        <div class="cert-text">The statements of fact contained in this report are true and correct.</div>
      </div>

      <div class="cert-statement">
        <div class="cert-number">2.</div>
        <div class="cert-text">The reported analyses, opinions, and conclusions are limited only by the reported assumptions and limiting conditions and are my personal, impartial, and unbiased professional analyses, opinions, and conclusions.</div>
      </div>

      <div class="cert-statement">
        <div class="cert-number">3.</div>
        <div class="cert-text">I have no present or prospective interest in the property that is the subject of this report and no personal interest with respect to the parties involved.</div>
      </div>

      <div class="cert-statement">
        <div class="cert-number">4.</div>
        <div class="cert-text">I have no bias with respect to the property that is the subject of this report or to the parties involved with this assignment.</div>
      </div>

      <div class="cert-statement">
        <div class="cert-number">5.</div>
        <div class="cert-text">My engagement in this assignment was not contingent upon developing or reporting predetermined results.</div>
      </div>

      <div class="cert-statement">
        <div class="cert-number">6.</div>
        <div class="cert-text">My compensation for completing this assignment is not contingent upon the development or reporting of a predetermined value or direction in value that favours the cause of the client, the amount of the value opinion, the attainment of a stipulated result, or the occurrence of a subsequent event directly related to the intended use of this appraisal.</div>
      </div>

      <div class="cert-statement">
        <div class="cert-number">7.</div>
        <div class="cert-text">My analyses, opinions, and conclusions were developed, and this report has been prepared, in conformity with the Canadian Uniform Standards of Professional Appraisal Practice (CUSPAP).</div>
      </div>

      <div class="cert-statement">
        <div class="cert-number">8.</div>
        <div class="cert-text">${appraiserName || 'The appraiser'} has made a personal inspection of the property that is the subject of this report.</div>
      </div>

      <div class="cert-statement">
        <div class="cert-number">9.</div>
        <div class="cert-text">No one provided significant real property appraisal assistance to the person signing this certification.</div>
      </div>

      <div class="cert-statement">
        <div class="cert-number">10.</div>
        <div class="cert-text">The reported analyses, opinions, and conclusions were developed, and this report has been prepared, in conformity with the Code of Professional Ethics of the Appraisal Institute of Canada.</div>
      </div>

      <div class="cert-statement">
        <div class="cert-number">11.</div>
        <div class="cert-text">The use of this report is subject to the requirements of the Appraisal Institute of Canada relating to review by its duly authorized representatives.</div>
      </div>

      <div class="cert-statement">
        <div class="cert-number">12.</div>
        <div class="cert-text">As of the date of this report, ${appraiserName || 'the appraiser'} has completed the continuing professional development program requirements of the Appraisal Institute of Canada.</div>
      </div>

      <!-- Signature Block -->
      <div class="cert-signature-block">
        <div class="cert-signature-line"></div>
        <div class="cert-signature-name">${appraiserName || 'Appraiser Name'}</div>
        <div class="cert-signature-credentials">${appraiserCredentials || 'AACI, P.App'}</div>
        <div class="cert-signature-title">${appraiserTitle || 'Senior Appraiser'}</div>
        <div class="cert-signature-company">${appraiserCompany || ''}</div>
        ${appraiserAicNumber ? `<div class="cert-signature-aic">AIC #${appraiserAicNumber}</div>` : ''}
        <div class="cert-signature-date">Date: ${certDate}</div>
      </div>
    </div>
    `;
  };

  // Helper function to render the HOME (Letter of Transmittal) section
  const renderHomeSection = (section: ReportSection): string => {
    const getFieldValue = (sec: ReportSection, fieldId: string): string => {
      const field = sec.fields?.find(f => f.id === fieldId);
      if (field?.value) return String(field.value);
      for (const subsection of sec.subsections || []) {
        const subField = subsection.fields?.find(f => f.id === fieldId);
        if (subField?.value) return String(subField.value);
      }
      return '';
    };

    // Format dates for professional display
    const formatDate = (dateStr: string): string => {
      if (!dateStr) return '';
      try {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      } catch {
        return dateStr;
      }
    };

    return `
    <div class="section page-break-before">
      <div style="margin-bottom: 2rem;">
        <div style="text-align: right; margin-bottom: 1.5rem; font-size: 11pt;">
          ${formatDate(reportDate) || formatDate(new Date().toISOString())}
        </div>

        <div style="margin-bottom: 1.5rem; line-height: 1.6;">
          ${clientCompany || 'Client Company'}<br/>
          ${clientAddress || ''}<br/>
          ${clientCity ? clientCity + ', ' : ''}${clientProvince || ''} ${clientPostal || ''}<br/>
          <br/>
          ${clientContactName ? 'Attention: ' + clientContactName : ''}
        </div>

        <div style="margin-bottom: 1.5rem; font-weight: 600;">
          <strong>Re:</strong> ${valueScenario} (${propertyRights}) current market value for the property located at ${streetAddress}, ${city}, ${province}.
        </div>

        <div style="margin-bottom: 1.5rem; line-height: 1.8; text-align: justify;">
          <p>${appraiserCompany || ''} is proud to present the appraisal report that satisfies the agreed upon scope of work with ${clientCompany}. The purpose of this assignment is to provide the ${valueScenario} current market value of the property which at the time of inspection represents the improved property as of the effective date and leased up at market rental rates and operating costs for the property located at ${streetAddress}, ${city}, ${province} (herein referred to as the 'subject property').</p>

          <p>The subject property, located at ${streetAddress}, ${city}, ${province}, is a ${propertyTypeLower}, ${buildingStyle} property with improvements located in ${city}. The improvements are comprised of ${totalBuildings} total building${parseInt(totalBuildings) > 1 ? 's' : ''}, and consist of ${totalNra ? Number(totalNra).toLocaleString() + ' square feet' : '[NRA]'} of net rentable area (NRA) as of the valuation date. The property, reportedly built in ${yearBuilt || '[Year]'}; (${yearBuilt || '[Year]'} weighted) is approximately ${formatPercent(occupancyRate)} occupied and features ${totalUnits || '[units]'} units in a ${stories}-story, ${buildingFormat} format.</p>

          <p>Based upon our investigation of the real estate market and after considering all of the pertinent facts as set forth in the body of this appraisal report, as of the effective date, we have concluded the following:</p>
        </div>

        <!-- Value Conclusion Box -->
        ${concludedValue ? `
        <div style="background: #f8f9fa; border: 2px solid #1a365d; padding: 1.5rem; margin: 1.5rem 0; text-align: center;">
          <div style="font-size: 14pt; font-weight: 700; color: #1a365d;">
            CONCLUDED ${valueScenario.toUpperCase()} MARKET VALUE
          </div>
          <div style="font-size: 20pt; font-weight: 800; color: #1a365d; margin-top: 0.5rem;">
            ${formatCurrency(concludedValue)}
          </div>
          <div style="font-size: 10pt; margin-top: 0.5rem; color: #4a5568;">
            As of ${formatDate(valuationDate)}
          </div>
        </div>
        ` : ''}

        <!-- Hypothetical Conditions -->
        ${hypotheticalConditions !== 'No Hypothetical Conditions were made for this assignment.' ? `
        <div style="margin-bottom: 1.5rem;">
          <h3 style="font-size: 12pt; font-weight: 700; color: #1a365d; margin-bottom: 0.5rem;">Hypothetical Conditions</h3>
          <div style="line-height: 1.7; text-align: justify;">
            <p>${hypotheticalConditions}</p>
          </div>
        </div>
        ` : `
        <div style="margin-bottom: 1rem;">
          <h3 style="font-size: 12pt; font-weight: 700; color: #1a365d; margin-bottom: 0.5rem;">Hypothetical Conditions</h3>
          <p>No Hypothetical Conditions were made for this assignment.</p>
        </div>
        `}

        <!-- Extraordinary Assumptions -->
        ${extraordinaryAssumptions !== 'No Extraordinary Assumptions were made for this assignment.' ? `
        <div style="margin-bottom: 1.5rem;">
          <h3 style="font-size: 12pt; font-weight: 700; color: #1a365d; margin-bottom: 0.5rem;">Extraordinary Assumptions</h3>
          <div style="line-height: 1.7; text-align: justify;">
            <p>${extraordinaryAssumptions}</p>
          </div>
        </div>
        ` : `
        <div style="margin-bottom: 1rem;">
          <h3 style="font-size: 12pt; font-weight: 700; color: #1a365d; margin-bottom: 0.5rem;">Extraordinary Assumptions</h3>
          <p>No Extraordinary Assumptions were made for this assignment.</p>
        </div>
        `}

        <!-- Extraordinary Limiting Conditions -->
        ${extraordinaryLimitingConditions !== 'No Extraordinary Limiting Conditions were made for this assignment.' ? `
        <div style="margin-bottom: 1.5rem;">
          <h3 style="font-size: 12pt; font-weight: 700; color: #1a365d; margin-bottom: 0.5rem;">Extraordinary Limiting Conditions</h3>
          <div style="line-height: 1.7; text-align: justify;">
            <p>${extraordinaryLimitingConditions}</p>
          </div>
        </div>
        ` : `
        <div style="margin-bottom: 1rem;">
          <h3 style="font-size: 12pt; font-weight: 700; color: #1a365d; margin-bottom: 0.5rem;">Extraordinary Limiting Conditions</h3>
          <p>No Extraordinary Limiting Conditions were made for this assignment.</p>
        </div>
        `}

        <!-- Compliance Statement -->
        <div style="margin: 1.5rem 0; line-height: 1.8; text-align: justify;">
          <p>The report has been completed in accordance with the Canadian Uniform Standards of Professional Appraisal Practice ("CUSPAP") adopted January 1, 2024. The full narrative appraisal report that follows sets forth the pertinent data and analyses leading to the conclusions presented herein. The appraisal requirements section of this report sets out the basis of the appraisal, definitions and the valuation methodology and must be read to gain a full understanding of the process.</p>

          <p>If there are any specific questions or concerns regarding the attached appraisal report, or if ${appraiserCompanyShort} can be of additional assistance, please contact the individuals listed below.</p>
        </div>

        <!-- Closing -->
        <div style="margin: 2rem 0 1rem 0; font-weight: 600;">
          Respectfully Submitted,<br/>
          ${appraiserCompany?.toUpperCase() || ''}
        </div>

        <!-- Signature Block -->
        <div style="margin-top: 3rem; margin-bottom: 2rem;">
          <div style="border-bottom: 2px solid #000; width: 250px; margin-bottom: 0.5rem;"></div>
          <div style="font-weight: 700; font-size: 11pt;">${appraiserName || 'Appraiser Name'}${appraiserCredentials ? ', ' + appraiserCredentials : ''}</div>
          ${appraiserTitle ? `<div style="font-size: 10pt; margin-top: 0.25rem;">${appraiserTitle}</div>` : ''}
          ${appraiserEmail ? `<div style="font-size: 10pt; margin-top: 0.25rem;">${appraiserEmail}</div>` : ''}
          ${appraiserAicNumber ? `<div style="font-size: 10pt; margin-top: 0.25rem;">AIC No: ${appraiserAicNumber}</div>` : ''}
        </div>
      </div>
    </div>
    `;
  };



  // Helper function to render the LOCATION section with custom template
  const renderLocationSection = (section: ReportSection): string => {
    const getFieldValue = (sec: ReportSection, fieldId: string): string => {
      const field = sec.fields?.find(f => f.id === fieldId);
      if (field?.value) return String(field.value);
      for (const subsection of sec.subsections || []) {
        const subField = subsection.fields?.find(f => f.id === fieldId);
        if (subField?.value) return String(subField.value);
      }
      return '';
    };

    const locationOverview = getFieldValue(section, 'location-overview');
    const locationAccess = getFieldValue(section, 'location-access');
    const walkScore = getFieldValue(section, 'location-walk-score');
    const transitScore = getFieldValue(section, 'location-transit-score');
    const bikeScore = getFieldValue(section, 'location-bike-score');
    const localArea = getFieldValue(section, 'location-local-area');
    const nearbySchools = getFieldValue(section, 'location-nearby-schools');
    const nearbyAmenities = getFieldValue(section, 'location-nearby-amenities');

    return `
    <div class="section page-break-before">
      <h2 class="section-title">Location Analysis</h2>

      <div class="narrative-text" style="margin-bottom: 20px;">
        ${locationOverview ? `<p>${locationOverview}</p>` : ''}
      </div>

      ${locationAccess ? `
      <h3 class="subsection-title">Access & Transportation</h3>
      <div class="narrative-text" style="margin-bottom: 20px;">
        <p>${locationAccess}</p>
      </div>
      ` : ''}

      <h3 class="subsection-title">Walkability & Transit Scores</h3>
      <table class="site-table">
        <thead>
          <tr>
            <th class="site-table-label" style="background: #1a365d; color: white;">Score Type</th>
            <th class="site-table-value" style="background: #1a365d; color: white;">Score</th>
            <th class="site-table-value" style="background: #1a365d; color: white;">Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="site-table-label">Walk Score</td>
            <td class="site-table-value">${walkScore || 'N/A'}</td>
            <td class="site-table-value">${parseInt(walkScore) >= 70 ? 'Very Walkable' : parseInt(walkScore) >= 50 ? 'Somewhat Walkable' : 'Car-Dependent'}</td>
          </tr>
          <tr>
            <td class="site-table-label">Transit Score</td>
            <td class="site-table-value">${transitScore || 'N/A'}</td>
            <td class="site-table-value">${parseInt(transitScore) >= 70 ? 'Excellent Transit' : parseInt(transitScore) >= 50 ? 'Good Transit' : 'Minimal Transit'}</td>
          </tr>
          <tr>
            <td class="site-table-label">Bike Score</td>
            <td class="site-table-value">${bikeScore || 'N/A'}</td>
            <td class="site-table-value">${parseInt(bikeScore) >= 70 ? 'Very Bikeable' : parseInt(bikeScore) >= 50 ? 'Bikeable' : 'Minimal Bike Infrastructure'}</td>
          </tr>
        </tbody>
      </table>

      ${localArea ? `
      <h3 class="subsection-title">Local Area Description</h3>
      <div class="narrative-text" style="margin-bottom: 20px;">
        <p>${localArea}</p>
      </div>
      ` : ''}

      ${nearbySchools ? `
      <h3 class="subsection-title">Nearby Schools</h3>
      <div class="narrative-text" style="margin-bottom: 20px;">
        <p>${nearbySchools}</p>
      </div>
      ` : ''}

      ${nearbyAmenities ? `
      <h3 class="subsection-title">Nearby Amenities</h3>
      <div class="narrative-text" style="margin-bottom: 20px;">
        <p>${nearbyAmenities}</p>
      </div>
      ` : ''}
    </div>
    `;
  };


  // Helper function to render the MARKET section with custom template
  const renderMarketSection = (section: ReportSection): string => {
    const getFieldValue = (sec: ReportSection, fieldId: string): string => {
      const field = sec.fields?.find(f => f.id === fieldId);
      if (field?.value) return String(field.value);
      for (const subsection of sec.subsections || []) {
        const subField = subsection.fields?.find(f => f.id === fieldId);
        if (subField?.value) return String(subField.value);
      }
      return '';
    };

    const nationalOverview = getFieldValue(section, 'market-national-overview');
    const nationalGdp = getFieldValue(section, 'market-national-gdp');
    const nationalUnemployment = getFieldValue(section, 'market-national-unemployment');
    const nationalInflation = getFieldValue(section, 'market-national-inflation');
    const nationalInterestRates = getFieldValue(section, 'market-national-interest-rates');

    const provincialOverview = getFieldValue(section, 'market-provincial-overview');
    const provincialGdp = getFieldValue(section, 'market-provincial-gdp');
    const provincialUnemployment = getFieldValue(section, 'market-provincial-unemployment');
    const provincialPopulation = getFieldValue(section, 'market-provincial-population');

    const localOverview = getFieldValue(section, 'market-local-overview');
    const localPopulation = getFieldValue(section, 'market-local-population');
    const localMedianIncome = getFieldValue(section, 'market-local-median-income');
    const localEmployment = getFieldValue(section, 'market-local-employment');

    const segmentOverview = getFieldValue(section, 'market-segment-overview');
    const segmentVacancy = getFieldValue(section, 'market-segment-vacancy');
    const segmentRentGrowth = getFieldValue(section, 'market-segment-rent-growth');
    const segmentCapRates = getFieldValue(section, 'market-segment-cap-rates');

    return `
    <div class="section page-break-before">
      <h2 class="section-title">Market Context</h2>

      <!-- National Economic Overview -->
      <h3 class="subsection-title">National Economic Overview</h3>
      <div class="narrative-text" style="margin-bottom: 15px;">
        ${nationalOverview ? `<p>${nationalOverview}</p>` : '<p>National economic overview not provided.</p>'}
      </div>
      <table class="site-table" style="margin-bottom: 25px;">
        <thead>
          <tr>
            <th class="site-table-label" style="background: #1a365d; color: white;">Indicator</th>
            <th class="site-table-value" style="background: #1a365d; color: white;">Value</th>
          </tr>
        </thead>
        <tbody>
          <tr><td class="site-table-label">GDP Growth</td><td class="site-table-value">${nationalGdp || 'N/A'}</td></tr>
          <tr><td class="site-table-label">Unemployment Rate</td><td class="site-table-value">${nationalUnemployment || 'N/A'}</td></tr>
          <tr><td class="site-table-label">Inflation Rate</td><td class="site-table-value">${nationalInflation || 'N/A'}</td></tr>
          <tr><td class="site-table-label">Interest Rates</td><td class="site-table-value">${nationalInterestRates || 'N/A'}</td></tr>
        </tbody>
      </table>

      <!-- Provincial Economic Overview -->
      <h3 class="subsection-title">Provincial Economic Overview</h3>
      <div class="narrative-text" style="margin-bottom: 15px;">
        ${provincialOverview ? `<p>${provincialOverview}</p>` : '<p>Provincial economic overview not provided.</p>'}
      </div>
      <table class="site-table" style="margin-bottom: 25px;">
        <thead>
          <tr>
            <th class="site-table-label" style="background: #1a365d; color: white;">Indicator</th>
            <th class="site-table-value" style="background: #1a365d; color: white;">Value</th>
          </tr>
        </thead>
        <tbody>
          <tr><td class="site-table-label">GDP Growth</td><td class="site-table-value">${provincialGdp || 'N/A'}</td></tr>
          <tr><td class="site-table-label">Unemployment Rate</td><td class="site-table-value">${provincialUnemployment || 'N/A'}</td></tr>
          <tr><td class="site-table-label">Population</td><td class="site-table-value">${provincialPopulation || 'N/A'}</td></tr>
        </tbody>
      </table>

      <!-- Local Economic Overview -->
      <h3 class="subsection-title">Local Economic Overview</h3>
      <div class="narrative-text" style="margin-bottom: 15px;">
        ${localOverview ? `<p>${localOverview}</p>` : '<p>Local economic overview not provided.</p>'}
      </div>
      <table class="site-table" style="margin-bottom: 25px;">
        <thead>
          <tr>
            <th class="site-table-label" style="background: #1a365d; color: white;">Indicator</th>
            <th class="site-table-value" style="background: #1a365d; color: white;">Value</th>
          </tr>
        </thead>
        <tbody>
          <tr><td class="site-table-label">Population</td><td class="site-table-value">${localPopulation || 'N/A'}</td></tr>
          <tr><td class="site-table-label">Median Household Income</td><td class="site-table-value">${localMedianIncome || 'N/A'}</td></tr>
          <tr><td class="site-table-label">Employment</td><td class="site-table-value">${localEmployment || 'N/A'}</td></tr>
        </tbody>
      </table>

      <!-- Multi-Family Market Overview -->
      <h3 class="subsection-title">Multi-Family Market Overview</h3>
      <div class="narrative-text" style="margin-bottom: 15px;">
        ${segmentOverview ? `<p>${segmentOverview}</p>` : '<p>Multi-family market overview not provided.</p>'}
      </div>
      <table class="site-table" style="margin-bottom: 25px;">
        <thead>
          <tr>
            <th class="site-table-label" style="background: #1a365d; color: white;">Indicator</th>
            <th class="site-table-value" style="background: #1a365d; color: white;">Value</th>
          </tr>
        </thead>
        <tbody>
          <tr><td class="site-table-label">Vacancy Rate</td><td class="site-table-value">${segmentVacancy || 'N/A'}</td></tr>
          <tr><td class="site-table-label">Rent Growth</td><td class="site-table-value">${segmentRentGrowth || 'N/A'}</td></tr>
          <tr><td class="site-table-label">Cap Rate Range</td><td class="site-table-value">${segmentCapRates || 'N/A'}</td></tr>
        </tbody>
      </table>
    </div>
    `;
  };



  // Helper function to render the RENTAL SURVEY section with custom template
  const renderRentalSurveySection = (section: ReportSection): string => {
    // Helper to format currency without decimals
    const formatCurrencyShort = (value: string): string => {
      if (!value) return '-';
      const num = parseFloat(value.replace(/[^0-9.-]/g, ''));
      if (isNaN(num)) return value;
      return `$${num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    };

    // Helper to format currency per SF
    const formatPerSF = (value: string): string => {
      if (!value) return '-';
      const num = parseFloat(value.replace(/[^0-9.-]/g, ''));
      if (isNaN(num)) return value;
      return `$${num.toFixed(2)}`;
    };

    // Subject Property Data
    const subjectName = getFieldValue(section, 'rental-subject-name');
    const subjectAddress = getFieldValue(section, 'rental-subject-address');
    const subjectCity = getFieldValue(section, 'rental-subject-city');
    const subjectProvince = getFieldValue(section, 'rental-subject-province');
    const subjectRentType = getFieldValue(section, 'rental-subject-rent-type');
    const subjectRentUnitAvg = getFieldValue(section, 'rental-subject-rent-unit-avg');
    const subjectRentSfAvg = getFieldValue(section, 'rental-subject-rent-sf-avg');
    const subjectUnitAmenities = getFieldValue(section, 'rental-subject-unit-amenities');
    const subjectUtilitiesIncld = getFieldValue(section, 'rental-subject-utilities-incld');
    const subjectParkingIncld = getFieldValue(section, 'rental-subject-parking-incld');
    const subjectParkingType = getFieldValue(section, 'rental-subject-parking-type');
    const subjectLaundry = getFieldValue(section, 'rental-subject-laundry');
    const subjectSurveyComments = getFieldValue(section, 'rental-subject-survey-comments');
    const subjectUnits = getFieldValue(section, 'rental-subject-units');
    const subjectAvgUnitSf = getFieldValue(section, 'rental-subject-avg-unit-sf');
    const subjectLocation = getFieldValue(section, 'rental-subject-location-rating');
    const subjectQuality = getFieldValue(section, 'rental-subject-quality-rating');
    const subjectCondition = getFieldValue(section, 'rental-subject-condition-rating');
    const subjectAppeal = getFieldValue(section, 'rental-subject-appeal-rating');
    const subjectProjectAmenities = getFieldValue(section, 'rental-subject-project-amenities');
    const subjectSecurityFeatures = getFieldValue(section, 'rental-subject-security-features');

    // Comp 1 Data
    const comp1Name = getFieldValue(section, 'rental-comp1-name');
    const comp1Address = getFieldValue(section, 'rental-comp1-address');
    const comp1City = getFieldValue(section, 'rental-comp1-city');
    const comp1Province = getFieldValue(section, 'rental-comp1-province');
    const comp1RentType = getFieldValue(section, 'rental-comp1-rent-type');
    const comp1RentUnitAvg = getFieldValue(section, 'rental-comp1-rent-unit-avg');
    const comp1RentSfAvg = getFieldValue(section, 'rental-comp1-rent-sf-avg');
    const comp1UnitAmenities = getFieldValue(section, 'rental-comp1-unit-amenities');
    const comp1UtilitiesIncld = getFieldValue(section, 'rental-comp1-utilities-incld');
    const comp1ParkingIncld = getFieldValue(section, 'rental-comp1-parking-incld');
    const comp1ParkingType = getFieldValue(section, 'rental-comp1-parking-type');
    const comp1Laundry = getFieldValue(section, 'rental-comp1-laundry');
    const comp1SurveyComments = getFieldValue(section, 'rental-comp1-survey-comments');
    const comp1Units = getFieldValue(section, 'rental-comp1-units');
    const comp1AvgUnitSf = getFieldValue(section, 'rental-comp1-avg-unit-sf');
    const comp1Location = getFieldValue(section, 'rental-comp1-location-rating');
    const comp1Quality = getFieldValue(section, 'rental-comp1-quality-rating');
    const comp1Condition = getFieldValue(section, 'rental-comp1-condition-rating');
    const comp1Appeal = getFieldValue(section, 'rental-comp1-appeal-rating');
    const comp1ProjectAmenities = getFieldValue(section, 'rental-comp1-project-amenities');
    const comp1SecurityFeatures = getFieldValue(section, 'rental-comp1-security-features');
    const comp1TotalAdjustments = getFieldValue(section, 'rental-comp1-total-adjustments');

    // Comp 2 Data
    const comp2Name = getFieldValue(section, 'rental-comp2-name');
    const comp2Address = getFieldValue(section, 'rental-comp2-address');
    const comp2City = getFieldValue(section, 'rental-comp2-city');
    const comp2Province = getFieldValue(section, 'rental-comp2-province');
    const comp2RentType = getFieldValue(section, 'rental-comp2-rent-type');
    const comp2RentUnitAvg = getFieldValue(section, 'rental-comp2-rent-unit-avg');
    const comp2RentSfAvg = getFieldValue(section, 'rental-comp2-rent-sf-avg');
    const comp2UnitAmenities = getFieldValue(section, 'rental-comp2-unit-amenities');
    const comp2UtilitiesIncld = getFieldValue(section, 'rental-comp2-utilities-incld');
    const comp2ParkingIncld = getFieldValue(section, 'rental-comp2-parking-incld');
    const comp2ParkingType = getFieldValue(section, 'rental-comp2-parking-type');
    const comp2Laundry = getFieldValue(section, 'rental-comp2-laundry');
    const comp2SurveyComments = getFieldValue(section, 'rental-comp2-survey-comments');
    const comp2Units = getFieldValue(section, 'rental-comp2-units');
    const comp2AvgUnitSf = getFieldValue(section, 'rental-comp2-avg-unit-sf');
    const comp2Location = getFieldValue(section, 'rental-comp2-location-rating');
    const comp2Quality = getFieldValue(section, 'rental-comp2-quality-rating');
    const comp2Condition = getFieldValue(section, 'rental-comp2-condition-rating');
    const comp2Appeal = getFieldValue(section, 'rental-comp2-appeal-rating');
    const comp2ProjectAmenities = getFieldValue(section, 'rental-comp2-project-amenities');
    const comp2SecurityFeatures = getFieldValue(section, 'rental-comp2-security-features');
    const comp2TotalAdjustments = getFieldValue(section, 'rental-comp2-total-adjustments');

    // Comp 3 Data
    const comp3Name = getFieldValue(section, 'rental-comp3-name');
    const comp3Address = getFieldValue(section, 'rental-comp3-address');
    const comp3City = getFieldValue(section, 'rental-comp3-city');
    const comp3Province = getFieldValue(section, 'rental-comp3-province');
    const comp3RentType = getFieldValue(section, 'rental-comp3-rent-type');
    const comp3RentUnitAvg = getFieldValue(section, 'rental-comp3-rent-unit-avg');
    const comp3RentSfAvg = getFieldValue(section, 'rental-comp3-rent-sf-avg');
    const comp3UnitAmenities = getFieldValue(section, 'rental-comp3-unit-amenities');
    const comp3UtilitiesIncld = getFieldValue(section, 'rental-comp3-utilities-incld');
    const comp3ParkingIncld = getFieldValue(section, 'rental-comp3-parking-incld');
    const comp3ParkingType = getFieldValue(section, 'rental-comp3-parking-type');
    const comp3Laundry = getFieldValue(section, 'rental-comp3-laundry');
    const comp3SurveyComments = getFieldValue(section, 'rental-comp3-survey-comments');
    const comp3Units = getFieldValue(section, 'rental-comp3-units');
    const comp3AvgUnitSf = getFieldValue(section, 'rental-comp3-avg-unit-sf');
    const comp3Location = getFieldValue(section, 'rental-comp3-location-rating');
    const comp3Quality = getFieldValue(section, 'rental-comp3-quality-rating');
    const comp3Condition = getFieldValue(section, 'rental-comp3-condition-rating');
    const comp3Appeal = getFieldValue(section, 'rental-comp3-appeal-rating');
    const comp3ProjectAmenities = getFieldValue(section, 'rental-comp3-project-amenities');
    const comp3SecurityFeatures = getFieldValue(section, 'rental-comp3-security-features');
    const comp3TotalAdjustments = getFieldValue(section, 'rental-comp3-total-adjustments');

    // Comp 4 Data
    const comp4Name = getFieldValue(section, 'rental-comp4-name');
    const comp4Address = getFieldValue(section, 'rental-comp4-address');
    const comp4City = getFieldValue(section, 'rental-comp4-city');
    const comp4Province = getFieldValue(section, 'rental-comp4-province');
    const comp4RentType = getFieldValue(section, 'rental-comp4-rent-type');
    const comp4RentUnitAvg = getFieldValue(section, 'rental-comp4-rent-unit-avg');
    const comp4RentSfAvg = getFieldValue(section, 'rental-comp4-rent-sf-avg');
    const comp4UnitAmenities = getFieldValue(section, 'rental-comp4-unit-amenities');
    const comp4UtilitiesIncld = getFieldValue(section, 'rental-comp4-utilities-incld');
    const comp4ParkingIncld = getFieldValue(section, 'rental-comp4-parking-incld');
    const comp4ParkingType = getFieldValue(section, 'rental-comp4-parking-type');
    const comp4Laundry = getFieldValue(section, 'rental-comp4-laundry');
    const comp4SurveyComments = getFieldValue(section, 'rental-comp4-survey-comments');
    const comp4Units = getFieldValue(section, 'rental-comp4-units');
    const comp4AvgUnitSf = getFieldValue(section, 'rental-comp4-avg-unit-sf');
    const comp4Location = getFieldValue(section, 'rental-comp4-location-rating');
    const comp4Quality = getFieldValue(section, 'rental-comp4-quality-rating');
    const comp4Condition = getFieldValue(section, 'rental-comp4-condition-rating');
    const comp4Appeal = getFieldValue(section, 'rental-comp4-appeal-rating');
    const comp4ProjectAmenities = getFieldValue(section, 'rental-comp4-project-amenities');
    const comp4SecurityFeatures = getFieldValue(section, 'rental-comp4-security-features');
    const comp4TotalAdjustments = getFieldValue(section, 'rental-comp4-total-adjustments');

    // Comp 5 Data
    const comp5Name = getFieldValue(section, 'rental-comp5-name');
    const comp5Address = getFieldValue(section, 'rental-comp5-address');
    const comp5City = getFieldValue(section, 'rental-comp5-city');
    const comp5Province = getFieldValue(section, 'rental-comp5-province');
    const comp5RentType = getFieldValue(section, 'rental-comp5-rent-type');
    const comp5RentUnitAvg = getFieldValue(section, 'rental-comp5-rent-unit-avg');
    const comp5RentSfAvg = getFieldValue(section, 'rental-comp5-rent-sf-avg');
    const comp5UnitAmenities = getFieldValue(section, 'rental-comp5-unit-amenities');
    const comp5UtilitiesIncld = getFieldValue(section, 'rental-comp5-utilities-incld');
    const comp5ParkingIncld = getFieldValue(section, 'rental-comp5-parking-incld');
    const comp5ParkingType = getFieldValue(section, 'rental-comp5-parking-type');
    const comp5Laundry = getFieldValue(section, 'rental-comp5-laundry');
    const comp5SurveyComments = getFieldValue(section, 'rental-comp5-survey-comments');
    const comp5Units = getFieldValue(section, 'rental-comp5-units');
    const comp5AvgUnitSf = getFieldValue(section, 'rental-comp5-avg-unit-sf');
    const comp5Location = getFieldValue(section, 'rental-comp5-location-rating');
    const comp5Quality = getFieldValue(section, 'rental-comp5-quality-rating');
    const comp5Condition = getFieldValue(section, 'rental-comp5-condition-rating');
    const comp5Appeal = getFieldValue(section, 'rental-comp5-appeal-rating');
    const comp5ProjectAmenities = getFieldValue(section, 'rental-comp5-project-amenities');
    const comp5SecurityFeatures = getFieldValue(section, 'rental-comp5-security-features');
    const comp5TotalAdjustments = getFieldValue(section, 'rental-comp5-total-adjustments');

    // 1BR Analysis Data
    const oneBrHigh = getFieldValue(section, 'rental-1br-high');
    const oneBrAvg = getFieldValue(section, 'rental-1br-avg');
    const oneBrMed = getFieldValue(section, 'rental-1br-med');
    const oneBrLow = getFieldValue(section, 'rental-1br-low');
    const oneBrHighRentUnit = getFieldValue(section, 'rental-1br-high-rent-unit');
    const oneBrAvgRentUnit = getFieldValue(section, 'rental-1br-avg-rent-unit');
    const oneBrMedRentUnit = getFieldValue(section, 'rental-1br-med-rent-unit');
    const oneBrLowRentUnit = getFieldValue(section, 'rental-1br-low-rent-unit');
    const oneBrHighRentSf = getFieldValue(section, 'rental-1br-high-rent-sf');
    const oneBrAvgRentSf = getFieldValue(section, 'rental-1br-avg-rent-sf');
    const oneBrMedRentSf = getFieldValue(section, 'rental-1br-med-rent-sf');
    const oneBrLowRentSf = getFieldValue(section, 'rental-1br-low-rent-sf');
    const oneBrHighAdjRentSf = getFieldValue(section, 'rental-1br-high-adj-rent-sf');
    const oneBrAvgAdjRentSf = getFieldValue(section, 'rental-1br-avg-adj-rent-sf');
    const oneBrMedAdjRentSf = getFieldValue(section, 'rental-1br-med-adj-rent-sf');
    const oneBrLowAdjRentSf = getFieldValue(section, 'rental-1br-low-adj-rent-sf');
    const oneBrConclusionType = getFieldValue(section, 'rental-1br-conclusion-type');
    const oneBrConclusionUnitSize = getFieldValue(section, 'rental-1br-conclusion-unit-size');
    const oneBrConclusionRentUnit = getFieldValue(section, 'rental-1br-conclusion-rent-unit');
    const oneBrConclusionRentSf = getFieldValue(section, 'rental-1br-conclusion-rent-sf');
    const oneBrConclusionSf = getFieldValue(section, 'rental-1br-conclusion-sf');
    const oneBrConclusion = getFieldValue(section, 'rental-1br-conclusion');

    // 2BR Analysis Data
    const twoBrHigh = getFieldValue(section, 'rental-2br-high');
    const twoBrAvg = getFieldValue(section, 'rental-2br-avg');
    const twoBrMed = getFieldValue(section, 'rental-2br-med');
    const twoBrLow = getFieldValue(section, 'rental-2br-low');
    const twoBrHighRentUnit = getFieldValue(section, 'rental-2br-high-rent-unit');
    const twoBrAvgRentUnit = getFieldValue(section, 'rental-2br-avg-rent-unit');
    const twoBrMedRentUnit = getFieldValue(section, 'rental-2br-med-rent-unit');
    const twoBrLowRentUnit = getFieldValue(section, 'rental-2br-low-rent-unit');
    const twoBrHighRentSf = getFieldValue(section, 'rental-2br-high-rent-sf');
    const twoBrAvgRentSf = getFieldValue(section, 'rental-2br-avg-rent-sf');
    const twoBrMedRentSf = getFieldValue(section, 'rental-2br-med-rent-sf');
    const twoBrLowRentSf = getFieldValue(section, 'rental-2br-low-rent-sf');
    const twoBrHighAdjRentSf = getFieldValue(section, 'rental-2br-high-adj-rent-sf');
    const twoBrAvgAdjRentSf = getFieldValue(section, 'rental-2br-avg-adj-rent-sf');
    const twoBrMedAdjRentSf = getFieldValue(section, 'rental-2br-med-adj-rent-sf');
    const twoBrLowAdjRentSf = getFieldValue(section, 'rental-2br-low-adj-rent-sf');
    const twoBrConclusionType = getFieldValue(section, 'rental-2br-conclusion-type');
    const twoBrConclusionUnitSize = getFieldValue(section, 'rental-2br-conclusion-unit-size');
    const twoBrConclusionRentUnit = getFieldValue(section, 'rental-2br-conclusion-rent-unit');
    const twoBrConclusionRentSf = getFieldValue(section, 'rental-2br-conclusion-rent-sf');
    const twoBrConclusionSf = getFieldValue(section, 'rental-2br-conclusion-sf');
    const twoBrConclusion = getFieldValue(section, 'rental-2br-conclusion');

    return `
    <div class="section">
      <h2 class="section-title">Rental Survey Comparison</h2>

      <!-- Main Survey Comparison Table -->
      <h3 class="subsection-title">Survey Comparison Table</h3>
      <table class="site-table" style="font-size: 0.7rem; width: 100%;">
        <thead>
          <tr style="background: #1a365d; color: white;">
            <th style="padding: 0.4rem; width: 15%;">Item</th>
            <th style="padding: 0.4rem; width: 14%;">SUBJECT</th>
            <th style="padding: 0.4rem; width: 14%;">COMP 1</th>
            <th style="padding: 0.4rem; width: 14%;">COMP 2</th>
            <th style="padding: 0.4rem; width: 14%;">COMP 3</th>
            <th style="padding: 0.4rem; width: 14%;">COMP 4</th>
            <th style="padding: 0.4rem; width: 14%;">COMP 5</th>
          </tr>
        </thead>
        <tbody>
          <!-- Property Identification -->
          <tr style="background: #f3f4f6;">
            <td style="padding: 0.4rem; font-weight: bold;">Property Name</td>
            <td style="padding: 0.4rem;">${subjectName || '-'}</td>
            <td style="padding: 0.4rem;">${comp1Name || '-'}</td>
            <td style="padding: 0.4rem;">${comp2Name || '-'}</td>
            <td style="padding: 0.4rem;">${comp3Name || '-'}</td>
            <td style="padding: 0.4rem;">${comp4Name || '-'}</td>
            <td style="padding: 0.4rem;">${comp5Name || '-'}</td>
          </tr>
          <tr>
            <td style="padding: 0.4rem; font-weight: bold;">Address</td>
            <td style="padding: 0.4rem;">${subjectAddress || '-'}</td>
            <td style="padding: 0.4rem;">${comp1Address || '-'}</td>
            <td style="padding: 0.4rem;">${comp2Address || '-'}</td>
            <td style="padding: 0.4rem;">${comp3Address || '-'}</td>
            <td style="padding: 0.4rem;">${comp4Address || '-'}</td>
            <td style="padding: 0.4rem;">${comp5Address || '-'}</td>
          </tr>
          <tr style="background: #f3f4f6;">
            <td style="padding: 0.4rem; font-weight: bold;">City</td>
            <td style="padding: 0.4rem;">${subjectCity || '-'}</td>
            <td style="padding: 0.4rem;">${comp1City || '-'}</td>
            <td style="padding: 0.4rem;">${comp2City || '-'}</td>
            <td style="padding: 0.4rem;">${comp3City || '-'}</td>
            <td style="padding: 0.4rem;">${comp4City || '-'}</td>
            <td style="padding: 0.4rem;">${comp5City || '-'}</td>
          </tr>
          <tr>
            <td style="padding: 0.4rem; font-weight: bold;">Province</td>
            <td style="padding: 0.4rem;">${subjectProvince || '-'}</td>
            <td style="padding: 0.4rem;">${comp1Province || '-'}</td>
            <td style="padding: 0.4rem;">${comp2Province || '-'}</td>
            <td style="padding: 0.4rem;">${comp3Province || '-'}</td>
            <td style="padding: 0.4rem;">${comp4Province || '-'}</td>
            <td style="padding: 0.4rem;">${comp5Province || '-'}</td>
          </tr>

          <!-- Rent Survey Information Header -->
          <tr style="background: #1a365d; color: white;">
            <td colspan="7" style="padding: 0.5rem; text-align: center; font-weight: bold;">RENT SURVEY INFORMATION</td>
          </tr>

          <tr style="background: #f3f4f6;">
            <td style="padding: 0.4rem; font-weight: bold;">Rent Type</td>
            <td style="padding: 0.4rem;">${subjectRentType || '-'}</td>
            <td style="padding: 0.4rem;">${comp1RentType || '-'}</td>
            <td style="padding: 0.4rem;">${comp2RentType || '-'}</td>
            <td style="padding: 0.4rem;">${comp3RentType || '-'}</td>
            <td style="padding: 0.4rem;">${comp4RentType || '-'}</td>
            <td style="padding: 0.4rem;">${comp5RentType || '-'}</td>
          </tr>
          <tr>
            <td style="padding: 0.4rem; font-weight: bold;">Rent/Unit Avg</td>
            <td style="padding: 0.4rem;">${formatCurrencyShort(subjectRentUnitAvg)}</td>
            <td style="padding: 0.4rem;">${formatCurrencyShort(comp1RentUnitAvg)}</td>
            <td style="padding: 0.4rem;">${formatCurrencyShort(comp2RentUnitAvg)}</td>
            <td style="padding: 0.4rem;">${formatCurrencyShort(comp3RentUnitAvg)}</td>
            <td style="padding: 0.4rem;">${formatCurrencyShort(comp4RentUnitAvg)}</td>
            <td style="padding: 0.4rem;">${formatCurrencyShort(comp5RentUnitAvg)}</td>
          </tr>
          <tr style="background: #f3f4f6;">
            <td style="padding: 0.4rem; font-weight: bold;">Rent/SF Avg</td>
            <td style="padding: 0.4rem;">${formatPerSF(subjectRentSfAvg)}</td>
            <td style="padding: 0.4rem;">${formatPerSF(comp1RentSfAvg)}</td>
            <td style="padding: 0.4rem;">${formatPerSF(comp2RentSfAvg)}</td>
            <td style="padding: 0.4rem;">${formatPerSF(comp3RentSfAvg)}</td>
            <td style="padding: 0.4rem;">${formatPerSF(comp4RentSfAvg)}</td>
            <td style="padding: 0.4rem;">${formatPerSF(comp5RentSfAvg)}</td>
          </tr>
          <tr>
            <td style="padding: 0.4rem; font-weight: bold;">Unit Amenities</td>
            <td style="padding: 0.4rem;">${subjectUnitAmenities || '-'}</td>
            <td style="padding: 0.4rem;">${comp1UnitAmenities || '-'}</td>
            <td style="padding: 0.4rem;">${comp2UnitAmenities || '-'}</td>
            <td style="padding: 0.4rem;">${comp3UnitAmenities || '-'}</td>
            <td style="padding: 0.4rem;">${comp4UnitAmenities || '-'}</td>
            <td style="padding: 0.4rem;">${comp5UnitAmenities || '-'}</td>
          </tr>
          <tr style="background: #f3f4f6;">
            <td style="padding: 0.4rem; font-weight: bold;">Utilities Incld.*</td>
            <td style="padding: 0.4rem;">${subjectUtilitiesIncld || '-'}</td>
            <td style="padding: 0.4rem;">${comp1UtilitiesIncld || '-'}</td>
            <td style="padding: 0.4rem;">${comp2UtilitiesIncld || '-'}</td>
            <td style="padding: 0.4rem;">${comp3UtilitiesIncld || '-'}</td>
            <td style="padding: 0.4rem;">${comp4UtilitiesIncld || '-'}</td>
            <td style="padding: 0.4rem;">${comp5UtilitiesIncld || '-'}</td>
          </tr>
          <tr>
            <td style="padding: 0.4rem; font-weight: bold;">Parking Incld.</td>
            <td style="padding: 0.4rem;">${subjectParkingIncld || '-'}</td>
            <td style="padding: 0.4rem;">${comp1ParkingIncld || '-'}</td>
            <td style="padding: 0.4rem;">${comp2ParkingIncld || '-'}</td>
            <td style="padding: 0.4rem;">${comp3ParkingIncld || '-'}</td>
            <td style="padding: 0.4rem;">${comp4ParkingIncld || '-'}</td>
            <td style="padding: 0.4rem;">${comp5ParkingIncld || '-'}</td>
          </tr>
          <tr style="background: #f3f4f6;">
            <td style="padding: 0.4rem; font-weight: bold;">Parking Type</td>
            <td style="padding: 0.4rem;">${subjectParkingType || '-'}</td>
            <td style="padding: 0.4rem;">${comp1ParkingType || '-'}</td>
            <td style="padding: 0.4rem;">${comp2ParkingType || '-'}</td>
            <td style="padding: 0.4rem;">${comp3ParkingType || '-'}</td>
            <td style="padding: 0.4rem;">${comp4ParkingType || '-'}</td>
            <td style="padding: 0.4rem;">${comp5ParkingType || '-'}</td>
          </tr>
          <tr>
            <td style="padding: 0.4rem; font-weight: bold;">Laundry</td>
            <td style="padding: 0.4rem;">${subjectLaundry || '-'}</td>
            <td style="padding: 0.4rem;">${comp1Laundry || '-'}</td>
            <td style="padding: 0.4rem;">${comp2Laundry || '-'}</td>
            <td style="padding: 0.4rem;">${comp3Laundry || '-'}</td>
            <td style="padding: 0.4rem;">${comp4Laundry || '-'}</td>
            <td style="padding: 0.4rem;">${comp5Laundry || '-'}</td>
          </tr>
          <tr style="background: #f3f4f6;">
            <td style="padding: 0.4rem; font-weight: bold;">Survey Comments</td>
            <td style="padding: 0.4rem; font-size: 0.65rem;">${subjectSurveyComments || '-'}</td>
            <td style="padding: 0.4rem; font-size: 0.65rem;">${comp1SurveyComments || '-'}</td>
            <td style="padding: 0.4rem; font-size: 0.65rem;">${comp2SurveyComments || '-'}</td>
            <td style="padding: 0.4rem; font-size: 0.65rem;">${comp3SurveyComments || '-'}</td>
            <td style="padding: 0.4rem; font-size: 0.65rem;">${comp4SurveyComments || '-'}</td>
            <td style="padding: 0.4rem; font-size: 0.65rem;">${comp5SurveyComments || '-'}</td>
          </tr>
        </tbody>
      </table>

      <!-- Utilities Legend -->
      <p style="font-size: 0.7rem; margin-top: 0.5rem; font-style: italic; color: #666;">
        *Electricity = E | Garbage = T | Gas = G | Hot-Water = HW | Sewer = S | Water = W | Cable/Satellite = C | Internet = I
      </p>


      <!-- PAGE BREAK - Split Survey Table from Building Info -->
      <div style="page-break-before: always;"></div>

      <!-- Building Information -->
      <h3 class="subsection-title" style="margin-top: 1.5rem;">Building Information</h3>
      <table class="site-table" style="font-size: 0.7rem; width: 100%;">
        <thead>
          <tr style="background: #1a365d; color: white;">
            <th style="padding: 0.4rem; width: 15%;">Item</th>
            <th style="padding: 0.4rem; width: 14%;">SUBJECT</th>
            <th style="padding: 0.4rem; width: 14%;">COMP 1</th>
            <th style="padding: 0.4rem; width: 14%;">COMP 2</th>
            <th style="padding: 0.4rem; width: 14%;">COMP 3</th>
            <th style="padding: 0.4rem; width: 14%;">COMP 4</th>
            <th style="padding: 0.4rem; width: 14%;">COMP 5</th>
          </tr>
        </thead>
        <tbody>
          <tr style="background: #f3f4f6;">
            <td style="padding: 0.4rem; font-weight: bold;">Units</td>
            <td style="padding: 0.4rem;">${subjectUnits || '-'}</td>
            <td style="padding: 0.4rem;">${comp1Units || '-'}</td>
            <td style="padding: 0.4rem;">${comp2Units || '-'}</td>
            <td style="padding: 0.4rem;">${comp3Units || '-'}</td>
            <td style="padding: 0.4rem;">${comp4Units || '-'}</td>
            <td style="padding: 0.4rem;">${comp5Units || '-'}</td>
          </tr>
          <tr>
            <td style="padding: 0.4rem; font-weight: bold;">Avg Unit SF</td>
            <td style="padding: 0.4rem;">${subjectAvgUnitSf ? `${Number(subjectAvgUnitSf).toLocaleString()} SF` : '-'}</td>
            <td style="padding: 0.4rem;">${comp1AvgUnitSf ? `${Number(comp1AvgUnitSf).toLocaleString()} SF` : '-'}</td>
            <td style="padding: 0.4rem;">${comp2AvgUnitSf ? `${Number(comp2AvgUnitSf).toLocaleString()} SF` : '-'}</td>
            <td style="padding: 0.4rem;">${comp3AvgUnitSf ? `${Number(comp3AvgUnitSf).toLocaleString()} SF` : '-'}</td>
            <td style="padding: 0.4rem;">${comp4AvgUnitSf ? `${Number(comp4AvgUnitSf).toLocaleString()} SF` : '-'}</td>
            <td style="padding: 0.4rem;">${comp5AvgUnitSf ? `${Number(comp5AvgUnitSf).toLocaleString()} SF` : '-'}</td>
          </tr>
          <tr style="background: #f3f4f6;">
            <td style="padding: 0.4rem; font-weight: bold;">Location</td>
            <td style="padding: 0.4rem;">${subjectLocation || '-'}</td>
            <td style="padding: 0.4rem;">${comp1Location || '-'}</td>
            <td style="padding: 0.4rem;">${comp2Location || '-'}</td>
            <td style="padding: 0.4rem;">${comp3Location || '-'}</td>
            <td style="padding: 0.4rem;">${comp4Location || '-'}</td>
            <td style="padding: 0.4rem;">${comp5Location || '-'}</td>
          </tr>
          <tr>
            <td style="padding: 0.4rem; font-weight: bold;">Quality</td>
            <td style="padding: 0.4rem;">${subjectQuality || '-'}</td>
            <td style="padding: 0.4rem;">${comp1Quality || '-'}</td>
            <td style="padding: 0.4rem;">${comp2Quality || '-'}</td>
            <td style="padding: 0.4rem;">${comp3Quality || '-'}</td>
            <td style="padding: 0.4rem;">${comp4Quality || '-'}</td>
            <td style="padding: 0.4rem;">${comp5Quality || '-'}</td>
          </tr>
          <tr style="background: #f3f4f6;">
            <td style="padding: 0.4rem; font-weight: bold;">Condition</td>
            <td style="padding: 0.4rem;">${subjectCondition || '-'}</td>
            <td style="padding: 0.4rem;">${comp1Condition || '-'}</td>
            <td style="padding: 0.4rem;">${comp2Condition || '-'}</td>
            <td style="padding: 0.4rem;">${comp3Condition || '-'}</td>
            <td style="padding: 0.4rem;">${comp4Condition || '-'}</td>
            <td style="padding: 0.4rem;">${comp5Condition || '-'}</td>
          </tr>
          <tr>
            <td style="padding: 0.4rem; font-weight: bold;">Appeal</td>
            <td style="padding: 0.4rem;">${subjectAppeal || '-'}</td>
            <td style="padding: 0.4rem;">${comp1Appeal || '-'}</td>
            <td style="padding: 0.4rem;">${comp2Appeal || '-'}</td>
            <td style="padding: 0.4rem;">${comp3Appeal || '-'}</td>
            <td style="padding: 0.4rem;">${comp4Appeal || '-'}</td>
            <td style="padding: 0.4rem;">${comp5Appeal || '-'}</td>
          </tr>
          <tr style="background: #f3f4f6;">
            <td style="padding: 0.4rem; font-weight: bold;">Project Amenities</td>
            <td style="padding: 0.4rem; font-size: 0.65rem;">${subjectProjectAmenities || '-'}</td>
            <td style="padding: 0.4rem; font-size: 0.65rem;">${comp1ProjectAmenities || '-'}</td>
            <td style="padding: 0.4rem; font-size: 0.65rem;">${comp2ProjectAmenities || '-'}</td>
            <td style="padding: 0.4rem; font-size: 0.65rem;">${comp3ProjectAmenities || '-'}</td>
            <td style="padding: 0.4rem; font-size: 0.65rem;">${comp4ProjectAmenities || '-'}</td>
            <td style="padding: 0.4rem; font-size: 0.65rem;">${comp5ProjectAmenities || '-'}</td>
          </tr>
          <tr>
            <td style="padding: 0.4rem; font-weight: bold;">Security Features</td>
            <td style="padding: 0.4rem; font-size: 0.65rem;">${subjectSecurityFeatures || '-'}</td>
            <td style="padding: 0.4rem; font-size: 0.65rem;">${comp1SecurityFeatures || '-'}</td>
            <td style="padding: 0.4rem; font-size: 0.65rem;">${comp2SecurityFeatures || '-'}</td>
            <td style="padding: 0.4rem; font-size: 0.65rem;">${comp3SecurityFeatures || '-'}</td>
            <td style="padding: 0.4rem; font-size: 0.65rem;">${comp4SecurityFeatures || '-'}</td>
            <td style="padding: 0.4rem; font-size: 0.65rem;">${comp5SecurityFeatures || '-'}</td>
          </tr>
          <tr style="background: #1a365d; color: white;">
            <td style="padding: 0.4rem; font-weight: bold;">Total Adjustments</td>
            <td style="padding: 0.4rem;">-</td>
            <td style="padding: 0.4rem;">${comp1TotalAdjustments || '-'}</td>
            <td style="padding: 0.4rem;">${comp2TotalAdjustments || '-'}</td>
            <td style="padding: 0.4rem;">${comp3TotalAdjustments || '-'}</td>
            <td style="padding: 0.4rem;">${comp4TotalAdjustments || '-'}</td>
            <td style="padding: 0.4rem;">${comp5TotalAdjustments || '-'}</td>
          </tr>
        </tbody>
      </table>

      <!-- PAGE BREAK -->
      <div style="page-break-before: always;"></div>

      <!-- 1BR Analysis Table -->
      <h3 class="subsection-title">1 Bedroom Units Analysis</h3>
      <table class="site-table" style="font-size: 0.75rem; margin-bottom: 1.5rem;">
        <thead>
          <tr style="background: #1a365d; color: white;">
            <th style="padding: 0.4rem;">COMP TYPE</th>
            <th style="padding: 0.4rem;">AVERAGE<br/>UNIT SIZE</th>
            <th style="padding: 0.4rem;">UNADJUSTED<br/>RENT/UNIT</th>
            <th style="padding: 0.4rem;">RENT/SF</th>
            <th style="padding: 0.4rem;">ADJUSTED<br/>RENT/SF</th>
          </tr>
        </thead>
        <tbody>
          <tr style="background: #f3f4f6; font-weight: bold;">
            <td style="padding: 0.4rem;">HIGH</td>
            <td style="padding: 0.4rem;">${oneBrHigh ? `${Number(oneBrHigh).toLocaleString()} SF` : '-'}</td>
            <td style="padding: 0.4rem;">${formatCurrencyShort(oneBrHighRentUnit)}</td>
            <td style="padding: 0.4rem;">${formatPerSF(oneBrHighRentSf)}</td>
            <td style="padding: 0.4rem;">${formatPerSF(oneBrHighAdjRentSf)}</td>
          </tr>
          <tr>
            <td style="padding: 0.4rem; font-weight: bold;">AVG</td>
            <td style="padding: 0.4rem;">${oneBrAvg ? `${Number(oneBrAvg).toLocaleString()} SF` : '-'}</td>
            <td style="padding: 0.4rem;">${formatCurrencyShort(oneBrAvgRentUnit)}</td>
            <td style="padding: 0.4rem;">${formatPerSF(oneBrAvgRentSf)}</td>
            <td style="padding: 0.4rem;">${formatPerSF(oneBrAvgAdjRentSf)}</td>
          </tr>
          <tr style="background: #f3f4f6;">
            <td style="padding: 0.4rem; font-weight: bold;">MED</td>
            <td style="padding: 0.4rem;">${oneBrMed ? `${Number(oneBrMed).toLocaleString()} SF` : '-'}</td>
            <td style="padding: 0.4rem;">${formatCurrencyShort(oneBrMedRentUnit)}</td>
            <td style="padding: 0.4rem;">${formatPerSF(oneBrMedRentSf)}</td>
            <td style="padding: 0.4rem;">${formatPerSF(oneBrMedAdjRentSf)}</td>
          </tr>
          <tr>
            <td style="padding: 0.4rem; font-weight: bold;">LOW</td>
            <td style="padding: 0.4rem;">${oneBrLow ? `${Number(oneBrLow).toLocaleString()} SF` : '-'}</td>
            <td style="padding: 0.4rem;">${formatCurrencyShort(oneBrLowRentUnit)}</td>
            <td style="padding: 0.4rem;">${formatPerSF(oneBrLowRentSf)}</td>
            <td style="padding: 0.4rem;">${formatPerSF(oneBrLowAdjRentSf)}</td>
          </tr>
        </tbody>
      </table>

      <!-- 1BR Conclusion Table -->
      <h4 style="color: #1a365d; margin-top: 1rem; margin-bottom: 0.5rem; font-size: 0.95rem;">Unit Type Analysis & Conclusions</h4>
      <table class="site-table" style="font-size: 0.75rem;">
        <thead>
          <tr style="background: #1a365d; color: white;">
            <th style="padding: 0.4rem;">TYPE</th>
            <th style="padding: 0.4rem;">UNIT SIZE</th>
            <th style="padding: 0.4rem;">RENT/UNIT</th>
            <th style="padding: 0.4rem;">RENT/SF</th>
            <th style="padding: 0.4rem;">CONCLUSION/SF</th>
            <th style="padding: 0.4rem;">CONCLUSION</th>
          </tr>
        </thead>
        <tbody>
          <tr style="background: #fffbeb;">
            <td style="padding: 0.4rem; font-weight: bold;">${oneBrConclusionType || '1 Bed/1 Bath'}</td>
            <td style="padding: 0.4rem;">${oneBrConclusionUnitSize ? `${Number(oneBrConclusionUnitSize).toLocaleString()} SF` : '-'}</td>
            <td style="padding: 0.4rem;">${formatCurrencyShort(oneBrConclusionRentUnit)}</td>
            <td style="padding: 0.4rem;">${formatPerSF(oneBrConclusionRentSf)}</td>
            <td style="padding: 0.4rem; font-weight: bold;">${formatPerSF(oneBrConclusionSf)}</td>
            <td style="padding: 0.4rem; font-weight: bold;">${formatCurrencyShort(oneBrConclusion)}</td>
          </tr>
        </tbody>
      </table>


      <!-- PAGE BREAK - Separate 1BR and 2BR Analysis -->
      <div style="page-break-before: always;"></div>

      <!-- 2BR Analysis Table -->
      <h3 class="subsection-title" style="margin-top: 2rem;">2 Bedroom Units Analysis</h3>
      <table class="site-table" style="font-size: 0.75rem; margin-bottom: 1.5rem;">
        <thead>
          <tr style="background: #1a365d; color: white;">
            <th style="padding: 0.4rem;">COMP TYPE</th>
            <th style="padding: 0.4rem;">AVERAGE<br/>UNIT SIZE</th>
            <th style="padding: 0.4rem;">UNADJUSTED<br/>RENT/UNIT</th>
            <th style="padding: 0.4rem;">RENT/SF</th>
            <th style="padding: 0.4rem;">ADJUSTED<br/>RENT/SF</th>
          </tr>
        </thead>
        <tbody>
          <tr style="background: #f3f4f6; font-weight: bold;">
            <td style="padding: 0.4rem;">HIGH</td>
            <td style="padding: 0.4rem;">${twoBrHigh ? `${Number(twoBrHigh).toLocaleString()} SF` : '-'}</td>
            <td style="padding: 0.4rem;">${formatCurrencyShort(twoBrHighRentUnit)}</td>
            <td style="padding: 0.4rem;">${formatPerSF(twoBrHighRentSf)}</td>
            <td style="padding: 0.4rem;">${formatPerSF(twoBrHighAdjRentSf)}</td>
          </tr>
          <tr>
            <td style="padding: 0.4rem; font-weight: bold;">AVG</td>
            <td style="padding: 0.4rem;">${twoBrAvg ? `${Number(twoBrAvg).toLocaleString()} SF` : '-'}</td>
            <td style="padding: 0.4rem;">${formatCurrencyShort(twoBrAvgRentUnit)}</td>
            <td style="padding: 0.4rem;">${formatPerSF(twoBrAvgRentSf)}</td>
            <td style="padding: 0.4rem;">${formatPerSF(twoBrAvgAdjRentSf)}</td>
          </tr>
          <tr style="background: #f3f4f6;">
            <td style="padding: 0.4rem; font-weight: bold;">MED</td>
            <td style="padding: 0.4rem;">${twoBrMed ? `${Number(twoBrMed).toLocaleString()} SF` : '-'}</td>
            <td style="padding: 0.4rem;">${formatCurrencyShort(twoBrMedRentUnit)}</td>
            <td style="padding: 0.4rem;">${formatPerSF(twoBrMedRentSf)}</td>
            <td style="padding: 0.4rem;">${formatPerSF(twoBrMedAdjRentSf)}</td>
          </tr>
          <tr>
            <td style="padding: 0.4rem; font-weight: bold;">LOW</td>
            <td style="padding: 0.4rem;">${twoBrLow ? `${Number(twoBrLow).toLocaleString()} SF` : '-'}</td>
            <td style="padding: 0.4rem;">${formatCurrencyShort(twoBrLowRentUnit)}</td>
            <td style="padding: 0.4rem;">${formatPerSF(twoBrLowRentSf)}</td>
            <td style="padding: 0.4rem;">${formatPerSF(twoBrLowAdjRentSf)}</td>
          </tr>
        </tbody>
      </table>

      <!-- 2BR Conclusion Table -->
      <h4 style="color: #1a365d; margin-top: 1rem; margin-bottom: 0.5rem; font-size: 0.95rem;">Unit Type Analysis & Conclusions</h4>
      <table class="site-table" style="font-size: 0.75rem;">
        <thead>
          <tr style="background: #1a365d; color: white;">
            <th style="padding: 0.4rem;">TYPE</th>
            <th style="padding: 0.4rem;">UNIT SIZE</th>
            <th style="padding: 0.4rem;">RENT/UNIT</th>
            <th style="padding: 0.4rem;">RENT/SF</th>
            <th style="padding: 0.4rem;">CONCLUSION/SF</th>
            <th style="padding: 0.4rem;">CONCLUSION</th>
          </tr>
        </thead>
        <tbody>
          <tr style="background: #fffbeb;">
            <td style="padding: 0.4rem; font-weight: bold;">${twoBrConclusionType || '2 Bed/1 Bath'}</td>
            <td style="padding: 0.4rem;">${twoBrConclusionUnitSize ? `${Number(twoBrConclusionUnitSize).toLocaleString()} SF` : '-'}</td>
            <td style="padding: 0.4rem;">${formatCurrencyShort(twoBrConclusionRentUnit)}</td>
            <td style="padding: 0.4rem;">${formatPerSF(twoBrConclusionRentSf)}</td>
            <td style="padding: 0.4rem; font-weight: bold;">${formatPerSF(twoBrConclusionSf)}</td>
            <td style="padding: 0.4rem; font-weight: bold;">${formatCurrencyShort(twoBrConclusion)}</td>
          </tr>
        </tbody>
      </table>
    </div>
    `;
  };

  // Helper function to render the CALC section (Income Calculator Results)
  const renderCalcSection = (section: ReportSection): string => {
    const getFieldValue = (sec: ReportSection, fieldId: string): string => {
      const field = sec.fields?.find(f => f.id === fieldId);
      if (field?.value) return String(field.value);
      for (const subsection of sec.subsections || []) {
        const subField = subsection.fields?.find(f => f.id === fieldId);
        if (subField?.value) return String(subField.value);
      }
      return '';
    };

    // Unit mix data
    const totalUnits = getFieldValue(section, 'calc-total-units') || '0';
    const unit1Type = getFieldValue(section, 'calc-unit-1-type');
    const unit1Count = getFieldValue(section, 'calc-unit-1-count');
    const unit1Rent = getFieldValue(section, 'calc-unit-1-rent');
    const unit2Type = getFieldValue(section, 'calc-unit-2-type');
    const unit2Count = getFieldValue(section, 'calc-unit-2-count');
    const unit2Rent = getFieldValue(section, 'calc-unit-2-rent');
    const unit3Type = getFieldValue(section, 'calc-unit-3-type');
    const unit3Count = getFieldValue(section, 'calc-unit-3-count');
    const unit3Rent = getFieldValue(section, 'calc-unit-3-rent');

    // Income calculations
    const pgr = getFieldValue(section, 'calc-pgr');
    const vacancyRate = getFieldValue(section, 'calc-vacancy-rate');
    const vacancyLoss = getFieldValue(section, 'calc-vacancy-loss');
    const egr = getFieldValue(section, 'calc-egr');
    const otherIncome = getFieldValue(section, 'calc-other-income');

    // Expenses
    const expManagement = getFieldValue(section, 'calc-exp-management');
    const expTaxes = getFieldValue(section, 'calc-exp-taxes');
    const expInsurance = getFieldValue(section, 'calc-exp-insurance');
    const expRepairs = getFieldValue(section, 'calc-exp-repairs');
    const expUtilities = getFieldValue(section, 'calc-exp-utilities');
    const expPayroll = getFieldValue(section, 'calc-exp-payroll');
    const expOther = getFieldValue(section, 'calc-exp-other');
    const totalExpenses = getFieldValue(section, 'calc-total-expenses');
    const expenseRatio = getFieldValue(section, 'calc-expense-ratio');

    // Value conclusion
    const noi = getFieldValue(section, 'calc-noi');
    const capRate = getFieldValue(section, 'calc-cap-rate');
    const indicatedValue = getFieldValue(section, 'calc-indicated-value');
    const valuePerUnit = getFieldValue(section, 'calc-value-per-unit');

    const formatCurrency = (val: string): string => {
      const num = parseFloat(val);
      if (isNaN(num)) return val || '$0';
      return '$' + num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    };

    return `
    <div class="section page-break-before">
      <h2 class="section-title">Income Approach - Calculation Summary</h2>

      <!-- Unit Mix Table -->
      <h3 class="subsection-title">Unit Mix Summary</h3>
      <table class="site-table" style="margin-bottom: 25px;">
        <thead>
          <tr>
            <th class="site-table-label" style="background: #1a365d; color: white;">Unit Type</th>
            <th class="site-table-value" style="background: #1a365d; color: white;">Count</th>
            <th class="site-table-value" style="background: #1a365d; color: white;">Monthly Rent</th>
            <th class="site-table-value" style="background: #1a365d; color: white;">Annual Rent</th>
          </tr>
        </thead>
        <tbody>
          ${unit1Type ? `<tr>
            <td class="site-table-label">${unit1Type}</td>
            <td class="site-table-value">${unit1Count}</td>
            <td class="site-table-value">${formatCurrency(unit1Rent)}</td>
            <td class="site-table-value">${formatCurrency(String(parseFloat(unit1Rent || '0') * parseInt(unit1Count || '0') * 12))}</td>
          </tr>` : ''}
          ${unit2Type ? `<tr>
            <td class="site-table-label">${unit2Type}</td>
            <td class="site-table-value">${unit2Count}</td>
            <td class="site-table-value">${formatCurrency(unit2Rent)}</td>
            <td class="site-table-value">${formatCurrency(String(parseFloat(unit2Rent || '0') * parseInt(unit2Count || '0') * 12))}</td>
          </tr>` : ''}
          ${unit3Type ? `<tr>
            <td class="site-table-label">${unit3Type}</td>
            <td class="site-table-value">${unit3Count}</td>
            <td class="site-table-value">${formatCurrency(unit3Rent)}</td>
            <td class="site-table-value">${formatCurrency(String(parseFloat(unit3Rent || '0') * parseInt(unit3Count || '0') * 12))}</td>
          </tr>` : ''}
          <tr style="font-weight: bold; background: #f0f0f0;">
            <td class="site-table-label">Total</td>
            <td class="site-table-value">${totalUnits}</td>
            <td class="site-table-value">-</td>
            <td class="site-table-value">${formatCurrency(pgr)}</td>
          </tr>
        </tbody>
      </table>

      <!-- Income Analysis -->
      <h3 class="subsection-title">Income Analysis</h3>
      <table class="site-table" style="margin-bottom: 25px;">
        <thead>
          <tr>
            <th class="site-table-label" style="background: #1a365d; color: white;">Item</th>
            <th class="site-table-value" style="background: #1a365d; color: white;">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="site-table-label">Potential Gross Revenue (PGR)</td>
            <td class="site-table-value">${formatCurrency(pgr)}</td>
          </tr>
          <tr>
            <td class="site-table-label">Less: Vacancy & Collection Loss (${vacancyRate || '0'}%)</td>
            <td class="site-table-value">(${formatCurrency(vacancyLoss)})</td>
          </tr>
          ${otherIncome ? `<tr>
            <td class="site-table-label">Plus: Other Income</td>
            <td class="site-table-value">${formatCurrency(otherIncome)}</td>
          </tr>` : ''}
          <tr style="font-weight: bold; background: #f0f0f0;">
            <td class="site-table-label">Effective Gross Revenue (EGR)</td>
            <td class="site-table-value">${formatCurrency(egr)}</td>
          </tr>
        </tbody>
      </table>

      <!-- Operating Expenses -->
      <h3 class="subsection-title">Operating Expenses</h3>
      <table class="site-table" style="margin-bottom: 25px;">
        <thead>
          <tr>
            <th class="site-table-label" style="background: #1a365d; color: white;">Expense Category</th>
            <th class="site-table-value" style="background: #1a365d; color: white;">Annual Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr><td class="site-table-label">Management</td><td class="site-table-value">${formatCurrency(expManagement)}</td></tr>
          <tr><td class="site-table-label">Property Taxes</td><td class="site-table-value">${formatCurrency(expTaxes)}</td></tr>
          <tr><td class="site-table-label">Insurance</td><td class="site-table-value">${formatCurrency(expInsurance)}</td></tr>
          <tr><td class="site-table-label">Repairs & Maintenance</td><td class="site-table-value">${formatCurrency(expRepairs)}</td></tr>
          <tr><td class="site-table-label">Utilities</td><td class="site-table-value">${formatCurrency(expUtilities)}</td></tr>
          ${expPayroll ? `<tr><td class="site-table-label">Payroll</td><td class="site-table-value">${formatCurrency(expPayroll)}</td></tr>` : ''}
          ${expOther ? `<tr><td class="site-table-label">Other Expenses</td><td class="site-table-value">${formatCurrency(expOther)}</td></tr>` : ''}
          <tr style="font-weight: bold; background: #f0f0f0;">
            <td class="site-table-label">Total Operating Expenses</td>
            <td class="site-table-value">${formatCurrency(totalExpenses)}</td>
          </tr>
          <tr>
            <td class="site-table-label">Expense Ratio</td>
            <td class="site-table-value">${expenseRatio || 'N/A'}%</td>
          </tr>
        </tbody>
      </table>

      <!-- Value Conclusion -->
      <h3 class="subsection-title">Value Conclusion - Income Approach</h3>
      <table class="site-table" style="margin-bottom: 25px;">
        <thead>
          <tr>
            <th class="site-table-label" style="background: #1a365d; color: white;">Item</th>
            <th class="site-table-value" style="background: #1a365d; color: white;">Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="site-table-label">Net Operating Income (NOI)</td>
            <td class="site-table-value">${formatCurrency(noi)}</td>
          </tr>
          <tr>
            <td class="site-table-label">Capitalization Rate</td>
            <td class="site-table-value">${capRate || 'N/A'}%</td>
          </tr>
          <tr style="font-weight: bold; background: #e8f4e8;">
            <td class="site-table-label">Indicated Value (Income Approach)</td>
            <td class="site-table-value" style="font-size: 14px;">${formatCurrency(indicatedValue)}</td>
          </tr>
          <tr>
            <td class="site-table-label">Value Per Unit</td>
            <td class="site-table-value">${formatCurrency(valuePerUnit)}</td>
          </tr>
        </tbody>
      </table>
    </div>
    `;
  };


  // Helper function to render the MAPS section with custom template
  // Now uses getGlobalFieldValue to find maps in image-mgt section
  const renderMapsSection = (_section: ReportSection): string => {
    // Use global lookup since maps are stored in image-mgt section
    const regionalMap = getGlobalFieldValue('img-map-regional') || '';
    const localMap = getGlobalFieldValue('img-map-local') || '';
    const aerialMap = getGlobalFieldValue('img-map-aerial-1') || '';
    const siteBoundaryMap = getGlobalFieldValue('img-map-aerial-2') || '';
    const zoningMapImg = getGlobalFieldValue('img-zoning-map') || '';
    const sitePlan1 = getGlobalFieldValue('img-site-plan-1') || '';
    const sitePlan2 = getGlobalFieldValue('img-site-plan-2') || '';

    return `
    <div class="section page-break-before">
      <h2 class="section-title">Maps of the Subject Property</h2>

      <div class="maps-grid" style="display: grid; grid-template-columns: 1fr; gap: 30px;">
        ${regionalMap ? `
        <div class="map-item" style="text-align: center;">
          <h3 class="subsection-title">Regional Location Map</h3>
          <img src="${regionalMap}" alt="Regional Location Map" style="max-width: 100%; height: auto; border: 1px solid #ccc;" />
        </div>
        ` : ''}

        ${localMap ? `
        <div style="page-break-before: always;"></div>
        <div class="map-item" style="text-align: center;">
          <h3 class="subsection-title">Local Area Map</h3>
          <img src="${localMap}" alt="Local Area Map" style="max-width: 100%; height: auto; border: 1px solid #ccc;" />
        </div>
        ` : ''}

        ${aerialMap ? `
        <div style="page-break-before: always;"></div>
        <div class="map-item" style="text-align: center;">
          <h3 class="subsection-title">Aerial View</h3>
          <img src="${aerialMap}" alt="Aerial View" style="max-width: 100%; height: auto; border: 1px solid #ccc;" />
        </div>
        ` : ''}

        ${siteBoundaryMap ? `
        <div style="page-break-before: always;"></div>
        <div class="map-item" style="text-align: center;">
          <h3 class="subsection-title">Site Boundary Map</h3>
          <img src="${siteBoundaryMap}" alt="Site Boundary Map" style="max-width: 100%; height: auto; border: 1px solid #ccc;" />
        </div>
        ` : ''}

        ${zoningMapImg ? `
        <div style="page-break-before: always;"></div>
        <div class="map-item" style="text-align: center;">
          <h3 class="subsection-title">Zoning Map</h3>
          <img src="${zoningMapImg}" alt="Zoning Map" style="max-width: 100%; height: auto; border: 1px solid #ccc;" />
        </div>
        ` : ''}

        ${sitePlan1 ? `
        <div style="page-break-before: always;"></div>
        <div class="map-item" style="text-align: center;">
          <h3 class="subsection-title">Site Plan</h3>
          <img src="${sitePlan1}" alt="Site Plan" style="max-width: 100%; height: auto; border: 1px solid #ccc;" />
        </div>
        ` : ''}

        ${sitePlan2 ? `
        <div style="page-break-before: always;"></div>
        <div class="map-item" style="text-align: center;">
          <h3 class="subsection-title">Survey/Plot Plan</h3>
          <img src="${sitePlan2}" alt="Survey/Plot Plan" style="max-width: 100%; height: auto; border: 1px solid #ccc;" />
        </div>
        ` : ''}
      </div>
    </div>
    `;
  };


  // Helper function to render the EXECUTIVE SUMMARY section with custom template
  const renderExecSection = (_section: ReportSection): string => {
    // Extract all required field values using getGlobalFieldValue for cross-section lookup

    // PROPERTY IDENTIFICATION fields
    const propName = getGlobalFieldValue('property-name') || '';
    const propType = getGlobalFieldValue('property-type-display') || '';
    const streetAddr = getGlobalFieldValue('street-address') || '';
    const cityVal = getGlobalFieldValue('city') || '';
    const provinceVal = getGlobalFieldValue('province') || '';
    const postalCode = getGlobalFieldValue('postal-code') || '';
    const market = getGlobalFieldValue('market') || '';
    const submarket = getGlobalFieldValue('submarket') || '';
    const latitudeVal = getGlobalFieldValue('latitude') || '';
    const longitudeVal = getGlobalFieldValue('longitude') || '';

    // SITE DESCRIPTION fields
    const legalDesc = getGlobalFieldValue('legal-description') || '';
    const landAreaUsableSf = getGlobalFieldValue('land-area-usable-sf') || '';
    const landAreaUsableAcres = getGlobalFieldValue('land-area-usable-acres') || '';
    const landAreaTotalSf = getGlobalFieldValue('site-total-area') || '';
    const landAreaTotalAcres = getGlobalFieldValue('site-acreage') || '';
    const zoningDesig = getGlobalFieldValue('zoning-classification') || '';
    const siteShape = getGlobalFieldValue('site-shape') || '';
    const topoVal = getGlobalFieldValue('topography') || '';

    // IMPROVEMENT DESCRIPTION fields
    const tenancyVal = getGlobalFieldValue('tenancy') || '';
    const totalNraVal = getGlobalFieldValue('total-nra') || getGlobalFieldValue('impv-nra') || '';
    const gbaVal = getGlobalFieldValue('gba') || getGlobalFieldValue('subject-gba') || '';
    const totalUnitsVal = getGlobalFieldValue('total-units') || getGlobalFieldValue('impv-num-units') || '';
    const densityUnitsAcre = getGlobalFieldValue('density-units-acre') || '';
    const totalBuildingsVal = getGlobalFieldValue('total-buildings') || getGlobalFieldValue('impv-num-buildings') || '';
    const storiesVal = getGlobalFieldValue('stories') || getGlobalFieldValue('impv-num-stories') || '';
    const yearBuiltVal = getGlobalFieldValue('year-built') || getGlobalFieldValue('impv-year-built') || '';
    const actualAgeVal = getGlobalFieldValue('actual-age') || '';
    const effectiveAgeVal = getGlobalFieldValue('effective-age') || '';
    const economicLifeVal = getGlobalFieldValue('economic-life') || '';
    const remainingLifeVal = getGlobalFieldValue('remaining-useful-life') || '';
    const parkingRatioVal = getGlobalFieldValue('parking-ratio') || getGlobalFieldValue('impv-parking-ratio') || '';
    const projectAmenitiesVal = getGlobalFieldValue('project-amenities') || getGlobalFieldValue('impv-project-amenities') || '';
    const laundryVal = getGlobalFieldValue('laundry') || getGlobalFieldValue('impv-laundry') || '';
    const securityVal = getGlobalFieldValue('security-features') || getGlobalFieldValue('security') || getGlobalFieldValue('impv-security') || '';

    // QUALITATIVE ANALYSIS fields
    const siteQualityVal = getGlobalFieldValue('site-quality') || '';
    const siteAccessVal = getGlobalFieldValue('site-access') || getGlobalFieldValue('accessibility') || '';
    const siteExposureVal = getGlobalFieldValue('site-exposure') || getGlobalFieldValue('exposure-visibility') || '';
    const siteUtilityVal = getGlobalFieldValue('site-utility') || '';
    const buildingQualityVal = getGlobalFieldValue('building-quality') || '';
    const buildingConditionVal = getGlobalFieldValue('building-condition') || getGlobalFieldValue('overall-condition') || getGlobalFieldValue('impv-overall-condition') || '';
    const buildingAppealVal = getGlobalFieldValue('building-appeal') || '';

    // Helper to format numbers with commas
    const formatNum = (val: any) => {
      if (!val) return '';
      const num = typeof val === 'string' ? parseFloat(val.replace(/,/g, '')) : val;
      return isNaN(num) ? val : num.toLocaleString();
    };

    return `
    <div class="section">
      <h2 class="section-title" style="border-bottom: 2px solid #1a4480; padding-bottom: 8px; margin-bottom: 24px;">Introduction & Executive Summary</h2>

      <h3 style="font-size: 11px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; color: #333; margin-bottom: 16px;">PROPERTY OVERVIEW</h3>

      <!-- 1. PROPERTY IDENTIFICATION -->
      <table class="exec-overview-table" style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 10px;">
        <thead>
          <tr>
            <th colspan="2" style="background-color: #1a4480; color: white; padding: 8px 12px; text-align: left; font-size: 10px; font-weight: 600; letter-spacing: 0.5px;">PROPERTY IDENTIFICATION</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 8px 12px; width: 30%; font-weight: 500; color: #555;">Name</td>
            <td style="padding: 8px 12px; color: #333;">${propName || '<span style="color: #999;">—</span>'}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 8px 12px; font-weight: 500; color: #555;">Property</td>
            <td style="padding: 8px 12px; color: #333;">${propType || '<span style="color: #999;">—</span>'}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 8px 12px; font-weight: 500; color: #555;">Address</td>
            <td style="padding: 8px 12px; color: #333;">${streetAddr || '<span style="color: #999;">—</span>'}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 8px 12px; font-weight: 500; color: #555;">City, Province, Postal Code</td>
            <td style="padding: 8px 12px; color: #333;">${cityVal && provinceVal ? `${cityVal}, ${provinceVal}${postalCode ? ' ' + postalCode : ''}` : '<span style="color: #999;">—</span>'}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 8px 12px; font-weight: 500; color: #555;">Market / Submarket</td>
            <td style="padding: 8px 12px; color: #333;">${market && submarket ? `${market} / ${submarket}` : market || submarket || '<span style="color: #999;">—</span>'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; font-weight: 500; color: #555;">Geocode</td>
            <td style="padding: 8px 12px; color: #333;">${latitudeVal && longitudeVal ? `${latitudeVal}, ${longitudeVal}` : '<span style="color: #999;">—</span>'}</td>
          </tr>
        </tbody>
      </table>

      <!-- 2. SITE DESCRIPTION -->
      <table class="exec-overview-table" style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 10px;">
        <thead>
          <tr>
            <th colspan="3" style="background-color: #1a4480; color: white; padding: 8px 12px; text-align: left; font-size: 10px; font-weight: 600; letter-spacing: 0.5px;">SITE DESCRIPTION</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td colspan="3" style="padding: 8px 12px;"><strong style="color: #555;">Legal Description</strong><br/><span style="color: #333;">${legalDesc || '<span style="color: #999;">—</span>'}</span></td>
          </tr>
          <tr style="background-color: #f3f4f6; border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 8px 12px; width: 50%; font-weight: 600; color: #333;">Land Area</td>
            <td style="padding: 8px 12px; width: 25%; font-weight: 600; text-align: center; color: #333;">Square Feet</td>
            <td style="padding: 8px 12px; width: 25%; font-weight: 600; text-align: center; color: #333;">Acres</td>
          </tr>
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 8px 12px; padding-left: 24px; color: #555;">Usable</td>
            <td style="padding: 8px 12px; text-align: center; color: #333;">${landAreaUsableSf ? formatNum(landAreaUsableSf) : '<span style="color: #999;">—</span>'}</td>
            <td style="padding: 8px 12px; text-align: center; color: #333;">${landAreaUsableAcres ? formatNum(landAreaUsableAcres) : '<span style="color: #999;">—</span>'}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 8px 12px; padding-left: 24px; color: #555;">Total</td>
            <td style="padding: 8px 12px; text-align: center; color: #333;">${landAreaTotalSf ? formatNum(landAreaTotalSf) : '<span style="color: #999;">—</span>'}</td>
            <td style="padding: 8px 12px; text-align: center; color: #333;">${landAreaTotalAcres ? formatNum(landAreaTotalAcres) : '<span style="color: #999;">—</span>'}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 8px 12px; font-weight: 500; color: #555;">Zoning</td>
            <td colspan="2" style="padding: 8px 12px; color: #333;">${zoningDesig || '<span style="color: #999;">—</span>'}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 8px 12px; font-weight: 500; color: #555;">Shape</td>
            <td colspan="2" style="padding: 8px 12px; color: #333;">${siteShape || '<span style="color: #999;">—</span>'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; font-weight: 500; color: #555;">Topography</td>
            <td colspan="2" style="padding: 8px 12px; color: #333;">${topoVal || '<span style="color: #999;">—</span>'}</td>
          </tr>
        </tbody>
      </table>

      <!-- 3. IMPROVEMENT DESCRIPTION -->
      <table class="exec-overview-table" style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 10px;">
        <thead>
          <tr>
            <th colspan="2" style="background-color: #1a4480; color: white; padding: 8px 12px; text-align: left; font-size: 10px; font-weight: 600; letter-spacing: 0.5px;">IMPROVEMENT DESCRIPTION</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 8px 12px; width: 40%; font-weight: 500; color: #555;">Tenancy</td>
            <td style="padding: 8px 12px; color: #333;">${tenancyVal || '<span style="color: #999;">—</span>'}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 8px 12px; font-weight: 500; color: #555;">Net Rentable Area (NRA)</td>
            <td style="padding: 8px 12px; color: #333;">${totalNraVal ? formatNum(totalNraVal) + ' SF' : '<span style="color: #999;">—</span>'}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 8px 12px; font-weight: 500; color: #555;">Gross Building Area (GBA)</td>
            <td style="padding: 8px 12px; color: #333;">${gbaVal ? formatNum(gbaVal) + ' SF' : '<span style="color: #999;">—</span>'}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 8px 12px; font-weight: 500; color: #555;">Units</td>
            <td style="padding: 8px 12px; color: #333;">${totalUnitsVal ? formatNum(totalUnitsVal) : '<span style="color: #999;">—</span>'}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 8px 12px; font-weight: 500; color: #555;">Density (Units/Acre)</td>
            <td style="padding: 8px 12px; color: #333;">${densityUnitsAcre ? formatNum(densityUnitsAcre) : '<span style="color: #999;">—</span>'}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 8px 12px; font-weight: 500; color: #555;">Total Buildings</td>
            <td style="padding: 8px 12px; color: #333;">${totalBuildingsVal || '<span style="color: #999;">—</span>'}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 8px 12px; font-weight: 500; color: #555;">Floors</td>
            <td style="padding: 8px 12px; color: #333;">${storiesVal || '<span style="color: #999;">—</span>'}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 8px 12px; font-weight: 500; color: #555;">Year Built</td>
            <td style="padding: 8px 12px; color: #333;">${yearBuiltVal ? `${yearBuiltVal}${yearBuiltVal ? ' (' + yearBuiltVal + ' weighted)' : ''}` : '<span style="color: #999;">—</span>'}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 8px 12px; font-weight: 500; color: #555;">Actual Age</td>
            <td style="padding: 8px 12px; color: #333;">${actualAgeVal ? actualAgeVal + ' Years' : '<span style="color: #999;">—</span>'}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 8px 12px; font-weight: 500; color: #555;">Effective Age</td>
            <td style="padding: 8px 12px; color: #333;">${effectiveAgeVal ? effectiveAgeVal + ' Years' : '<span style="color: #999;">—</span>'}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 8px 12px; font-weight: 500; color: #555;">Economic Life</td>
            <td style="padding: 8px 12px; color: #333;">${economicLifeVal ? economicLifeVal + ' Years' : '<span style="color: #999;">—</span>'}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 8px 12px; font-weight: 500; color: #555;">Remaining Useful Life</td>
            <td style="padding: 8px 12px; color: #333;">${remainingLifeVal ? remainingLifeVal + ' Years' : '<span style="color: #999;">—</span>'}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 8px 12px; font-weight: 500; color: #555;">Parking</td>
            <td style="padding: 8px 12px; color: #333;">${parkingRatioVal ? parkingRatioVal + ' / Unit' : '<span style="color: #999;">—</span>'}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 8px 12px; font-weight: 500; color: #555;">Project Amenities</td>
            <td style="padding: 8px 12px; color: #333;">${projectAmenitiesVal || '<span style="color: #999;">—</span>'}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 8px 12px; font-weight: 500; color: #555;">Laundry</td>
            <td style="padding: 8px 12px; color: #333;">${laundryVal || '<span style="color: #999;">—</span>'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; font-weight: 500; color: #555;">Security Features</td>
            <td style="padding: 8px 12px; color: #333;">${securityVal || '<span style="color: #999;">—</span>'}</td>
          </tr>
        </tbody>
      </table>

      <!-- 4. QUALITATIVE ANALYSIS -->
      <table class="exec-overview-table" style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 10px;">
        <thead>
          <tr>
            <th colspan="2" style="background-color: #1a4480; color: white; padding: 8px 12px; text-align: left; font-size: 10px; font-weight: 600; letter-spacing: 0.5px;">QUALITATIVE ANALYSIS</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 8px 12px; width: 40%; font-weight: 500; color: #555;">Site Quality</td>
            <td style="padding: 8px 12px; color: #333;">${siteQualityVal || '<span style="color: #999;">—</span>'}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 8px 12px; font-weight: 500; color: #555;">Site Access</td>
            <td style="padding: 8px 12px; color: #333;">${siteAccessVal || '<span style="color: #999;">—</span>'}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 8px 12px; font-weight: 500; color: #555;">Site Exposure</td>
            <td style="padding: 8px 12px; color: #333;">${siteExposureVal || '<span style="color: #999;">—</span>'}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 8px 12px; font-weight: 500; color: #555;">Site Utility</td>
            <td style="padding: 8px 12px; color: #333;">${siteUtilityVal || '<span style="color: #999;">—</span>'}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 8px 12px; font-weight: 500; color: #555;">Building Quality</td>
            <td style="padding: 8px 12px; color: #333;">${buildingQualityVal || '<span style="color: #999;">—</span>'}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 8px 12px; font-weight: 500; color: #555;">Building Condition</td>
            <td style="padding: 8px 12px; color: #333;">${buildingConditionVal || '<span style="color: #999;">—</span>'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; font-weight: 500; color: #555;">Building Appeal</td>
            <td style="padding: 8px 12px; color: #333;">${buildingAppealVal || '<span style="color: #999;">—</span>'}</td>
          </tr>
        </tbody>
      </table>
    </div>
    `;
  };


  // Helper function to render the Table of Contents
  const renderTableOfContents = (sections: ReportSection[]): string => {
    const tocEntries = [
      { title: 'Letter of Transmittal', page: 1 },
      { title: 'Summary of Salient Features', page: 2 },
      { title: 'Photographs of the Subject Property', page: 4 },
      { title: 'Maps of the Subject Property', page: 9 },
      { title: 'Identification of the Assignment', page: 12 },
      { title: 'Location Analysis', page: 17 },
      { title: 'Site Description', page: 18 },
      { title: 'Property Taxes', page: 23 },
      { title: 'Land Use & Planning', page: 24 },
      { title: 'Improvements', page: 26 },
      { title: 'Market Context', page: 29 },
      { title: 'Highest & Best Use', page: 32 },
      { title: 'Valuation Methodology', page: 34 },
      { title: 'Income Approach', page: 36 },
      { title: 'Sales Comparison Approach', page: 50 },
      { title: 'Reconciliation & Final Value Estimate', page: 61 },
      { title: 'Certification', page: 63 },
      { title: 'Addenda', page: 65, isHeader: true },
      { title: 'Contingent & Limiting Conditions', page: 65, indent: true },
      { title: 'Definition of Terms', page: 68, indent: true },
      { title: 'Qualifications of the Appraiser', page: 72, indent: true },
    ];

    return `
    <div class="section toc-section page-break-before">
      <h1 style="text-align: center; font-size: 24px; font-weight: bold; margin-bottom: 30px; text-transform: uppercase;">Table of Contents</h1>
      <div class="toc-container" style="max-width: 600px; margin: 0 auto;">
        ${tocEntries.map(entry => `
          <div class="toc-entry" style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: ${(entry as { isHeader?: boolean }).isHeader ? '15px' : '8px'}; padding-left: ${(entry as { indent?: boolean }).indent ? '20px' : '0'};">
            <span class="toc-title" style="font-size: 12px; ${(entry as { isHeader?: boolean }).isHeader ? 'font-weight: bold; text-transform: uppercase;' : ''}">${entry.title}</span>
            <span class="toc-dots" style="flex: 1; border-bottom: 1px dotted #999; margin: 0 10px;"></span>
            <span class="toc-page" style="font-size: 12px; font-weight: 500;">${entry.page}</span>
          </div>
        `).join('')}
      </div>
    </div>
    `;
  };


  // Appendix Renderer Functions

  const renderLimitingConditionsAppendix = (): string => {
    return `
    <div class="section appendix-section page-break-before">
      <h1 style="text-align: center; font-size: 20px; font-weight: bold; margin-bottom: 30px; text-transform: uppercase;">Contingent and Limiting Conditions</h1>
      
      <div class="appendix-content" style="font-size: 11px; line-height: 1.6;">
        <p style="margin-bottom: 15px;">This appraisal is made subject to the following contingent and limiting conditions:</p>
        
        <ol style="margin-left: 20px;">
          <li style="margin-bottom: 12px;">The legal description and property dimensions used in this report are assumed to be correct. No survey was made by the appraiser.</li>
          
          <li style="margin-bottom: 12px;">No responsibility is assumed for matters legal in nature. Title to the property is assumed to be good and marketable unless otherwise stated.</li>
          
          <li style="margin-bottom: 12px;">Information furnished by others is believed to be reliable, but no warranty is given for its accuracy.</li>
          
          <li style="margin-bottom: 12px;">All mortgages, liens, encumbrances, leases, and servitudes have been disregarded unless so specified within this report.</li>
          
          <li style="margin-bottom: 12px;">It is assumed that there are no hidden or unapparent conditions of the property, subsoil, or structures that render it more or less valuable.</li>
          
          <li style="margin-bottom: 12px;">Unless stated otherwise, no consideration has been given to mineral or subsurface rights.</li>
          
          <li style="margin-bottom: 12px;">The appraiser is not required to give testimony or appear in court because of having made this appraisal, unless arrangements have been previously made.</li>
          
          <li style="margin-bottom: 12px;">The distribution of the total valuation in this report between land and improvements applies only under the existing program of utilization.</li>
          
          <li style="margin-bottom: 12px;">It is assumed that there is full compliance with all applicable federal, provincial, and local environmental regulations and laws unless otherwise stated.</li>
          
          <li style="margin-bottom: 12px;">It is assumed that all applicable zoning and use regulations and restrictions have been complied with, unless a nonconformity has been stated, defined, and considered in this appraisal report.</li>
          
          <li style="margin-bottom: 12px;">It is assumed that all required licenses, certificates of occupancy, and other governmental consents have been or can be obtained and renewed for any use on which the value estimate is based.</li>
          
          <li style="margin-bottom: 12px;">Any sketch or survey in this report is included to assist the reader in visualizing the property and is not to be considered a legal survey.</li>
          
          <li style="margin-bottom: 12px;">The appraiser has inspected, as far as possible by observation, the land and the improvements. It is not possible to personally observe conditions beneath the soil or hidden structural components.</li>
          
          <li style="margin-bottom: 12px;">The value estimated is gross, without consideration given to any encumbrance, restriction, or question of title, unless specifically defined.</li>
          
          <li style="margin-bottom: 12px;">The effective date of value to which the conclusions and opinions expressed apply is set forth in this report. The value opinion is based on the purchasing power of the Canadian dollar as of that date.</li>
        </ol>
      </div>
    </div>
    `;
  };

  const renderDefinitionsAppendix = (): string => {
    return `
    <div class="section appendix-section page-break-before">
      <h1 style="text-align: center; font-size: 20px; font-weight: bold; margin-bottom: 30px; text-transform: uppercase;">Definition of Terms</h1>
      
      <div class="appendix-content" style="font-size: 11px; line-height: 1.6;">
        <div style="margin-bottom: 20px;">
          <h3 style="font-size: 12px; font-weight: bold; margin-bottom: 8px;">Market Value</h3>
          <p>The most probable price, as of a specified date, in cash, or in terms equivalent to cash, or in other precisely revealed terms, for which the specified property rights should sell after reasonable exposure in a competitive market under all conditions requisite to a fair sale, with the buyer and seller each acting prudently, knowledgeably, and for self-interest, and assuming that neither is under undue duress.</p>
        </div>
        
        <div style="margin-bottom: 20px;">
          <h3 style="font-size: 12px; font-weight: bold; margin-bottom: 8px;">Fee Simple Estate</h3>
          <p>Absolute ownership unencumbered by any other interest or estate, subject only to the limitations imposed by the governmental powers of taxation, eminent domain, police power, and escheat.</p>
        </div>
        
        <div style="margin-bottom: 20px;">
          <h3 style="font-size: 12px; font-weight: bold; margin-bottom: 8px;">Leased Fee Estate</h3>
          <p>An ownership interest held by a landlord with the right of use and occupancy conveyed by lease to others. The rights of the lessor (the leased fee owner) and the leased fee are specified by contract terms contained within the lease.</p>
        </div>
        
        <div style="margin-bottom: 20px;">
          <h3 style="font-size: 12px; font-weight: bold; margin-bottom: 8px;">Highest and Best Use</h3>
          <p>The reasonably probable and legal use of vacant land or an improved property that is physically possible, appropriately supported, financially feasible, and that results in the highest value.</p>
        </div>
        
        <div style="margin-bottom: 20px;">
          <h3 style="font-size: 12px; font-weight: bold; margin-bottom: 8px;">Depreciation</h3>
          <p>A loss in property value from any cause; the difference between the cost of an improvement on the effective date of the appraisal and the market value of the improvement on the same date.</p>
        </div>
        
        <div style="margin-bottom: 20px;">
          <h3 style="font-size: 12px; font-weight: bold; margin-bottom: 8px;">Capitalization Rate</h3>
          <p>Any rate used to convert income to value. The ratio of net operating income to value.</p>
        </div>
        
        <div style="margin-bottom: 20px;">
          <h3 style="font-size: 12px; font-weight: bold; margin-bottom: 8px;">Net Operating Income (NOI)</h3>
          <p>The actual or anticipated net income that remains after all operating expenses are deducted from effective gross income, but before mortgage debt service and book depreciation are deducted.</p>
        </div>
        
        <div style="margin-bottom: 20px;">
          <h3 style="font-size: 12px; font-weight: bold; margin-bottom: 8px;">Effective Gross Income (EGI)</h3>
          <p>The anticipated income from all operations of the real property after an allowance is made for vacancy and collection losses and an addition is made for any other income.</p>
        </div>
        
        <div style="margin-bottom: 20px;">
          <h3 style="font-size: 12px; font-weight: bold; margin-bottom: 8px;">Potential Gross Income (PGI)</h3>
          <p>The total income attributable to real property at full occupancy before vacancy and operating expenses are deducted.</p>
        </div>
        
        <div style="margin-bottom: 20px;">
          <h3 style="font-size: 12px; font-weight: bold; margin-bottom: 8px;">Gross Rent Multiplier (GRM)</h3>
          <p>The ratio of the sale price of a property to its gross rental income.</p>
        </div>
      </div>
    </div>
    `;
  };

  const renderQualificationsAppendix = (section: ReportSection): string => {
    const getFieldValue = (fieldId: string): string => {
      const field = section.fields?.find(f => f.id === fieldId);
      return field?.value as string || '';
    };

    const appraiserName = getFieldValue('appraiser-name') || 'Appraiser Name';
    const appraiserDesignation = getFieldValue('appraiser-designation') || 'AACI, P.App';

    return `
    <div class="section appendix-section page-break-before">
      <h1 style="text-align: center; font-size: 20px; font-weight: bold; margin-bottom: 30px; text-transform: uppercase;">Qualifications of the Appraiser</h1>
      
      <div class="appendix-content" style="font-size: 11px; line-height: 1.6;">
        <h2 style="font-size: 14px; font-weight: bold; margin-bottom: 20px; text-align: center;">${appraiserName}, ${appraiserDesignation}</h2>
        
        <div style="margin-bottom: 20px;">
          <h3 style="font-size: 12px; font-weight: bold; margin-bottom: 8px;">Professional Designations</h3>
          <ul style="margin-left: 20px;">
            <li>Accredited Appraiser Canadian Institute (AACI)</li>
            <li>Professional Appraiser (P.App)</li>
            <li>Member, Appraisal Institute of Canada</li>
          </ul>
        </div>
        
        <div style="margin-bottom: 20px;">
          <h3 style="font-size: 12px; font-weight: bold; margin-bottom: 8px;">Education</h3>
          <ul style="margin-left: 20px;">
            <li>Bachelor of Commerce, Real Estate Major</li>
            <li>Appraisal Institute of Canada - Professional Development Program</li>
            <li>Continuing Professional Development - Current</li>
          </ul>
        </div>
        
        <div style="margin-bottom: 20px;">
          <h3 style="font-size: 12px; font-weight: bold; margin-bottom: 8px;">Experience</h3>
          <p>Over 15 years of experience in the appraisal of residential, commercial, and industrial properties throughout Western Canada. Specialization includes:</p>
          <ul style="margin-left: 20px;">
            <li>Multi-family residential properties</li>
            <li>Commercial retail and office properties</li>
            <li>Industrial properties</li>
            <li>Development land analysis</li>
            <li>Market studies and feasibility analysis</li>
          </ul>
        </div>
        
        <div style="margin-bottom: 20px;">
          <h3 style="font-size: 12px; font-weight: bold; margin-bottom: 8px;">Professional Memberships</h3>
          <ul style="margin-left: 20px;">
            <li>Appraisal Institute of Canada - Full Member</li>
            <li>Saskatchewan Association of Real Estate Appraisers</li>
          </ul>
        </div>
      </div>
    </div>
    `;
  };



  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Appraisal Report</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    html {
      scroll-behavior: smooth;
    }

    body {
      counter-reset: page;
      font-family: 'Times New Roman', Times, serif;
      line-height: 1.6;
      color: #00000a;
      background: #fff;
      font-size: 12px;
    }

    /* .page is now semantic only - no fixed dimensions */
    /* Print CSS handles pagination automatically */
    .page {
      max-width: 8.5in;
      margin: 0 auto;
      background: white;
      padding: 0.75in;
      position: relative;
    }

    /* Section separators for visual clarity in preview */
    .section {
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #e5e7eb;
    }

    /* Cover Page Styles - Matching Valcre Design */
    /* Cover page is special - maintains full page dimensions even in continuous preview */
    .cover-page {
      position: relative;
      min-height: 11in;
      padding: 0;
      overflow: hidden;
      background: white;
    }

    /* Top logo section */
    .cover-logo-header {
      padding: 0.75in 0.75in 0.5in 0.75in;
    }

    .cover-logo {
      max-width: 280px;
      height: auto;
    }

    /* Main content area - two columns */
    .cover-main {
      display: flex;
      padding: 0 0.75in;
      min-height: 4in;
    }

    .cover-photo-column {
      width: 50%;
      padding-right: 1rem;
      position: relative;
    }

    .cover-photo {
      width: 100%;
      max-width: 380px;
      height: auto;
      border: none;
      /* Feathered edge effect using mask gradients */
      -webkit-mask-image:
        linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 75%, rgba(0,0,0,0) 100%),
        linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 85%, rgba(0,0,0,0) 100%);
      -webkit-mask-composite: source-in;
      mask-image:
        linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 75%, rgba(0,0,0,0) 100%),
        linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 85%, rgba(0,0,0,0) 100%);
      mask-composite: intersect;
      /* Subtle shadow for depth */
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    }

    .cover-photo-placeholder {
      width: 100%;
      max-width: 380px;
      height: 280px;
      background: #f3f4f6;
      border: 2px dashed #d1d5db;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #9ca3af;
      font-size: 11px;
      text-align: center;
      padding: 1rem;
      /* Match feathered effect for placeholder */
      -webkit-mask-image:
        linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 75%, rgba(0,0,0,0) 100%),
        linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 85%, rgba(0,0,0,0) 100%);
      -webkit-mask-composite: source-in;
      mask-image:
        linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 75%, rgba(0,0,0,0) 100%),
        linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 85%, rgba(0,0,0,0) 100%);
      mask-composite: intersect;
    }

    .cover-content-column {
      width: 50%;
      text-align: right;
      padding-top: 0.5in;
    }

    .cover-title {
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 1.5rem;
      color: #000;
    }

    .property-info {
      margin-bottom: 2rem;
    }

    .property-type {
      font-size: 14px;
      font-weight: bold;
      margin-bottom: 0.25rem;
    }

    .property-name {
      font-size: 12px;
      margin-bottom: 0.25rem;
    }

    .property-address {
      font-size: 12px;
      margin-bottom: 0.125rem;
    }

    .property-city {
      font-size: 12px;
    }

    /* Diagonal blue section at bottom */
    .cover-blue-section {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: #1a365d;
      color: white;
      padding: 2rem 0.75in 1rem 0.75in;
      clip-path: polygon(0 15%, 100% 0, 100% 100%, 0 100%);
      min-height: 4.5in;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
    }

    .cover-blue-content {
      text-align: right;
      padding-top: 1.5in;
    }

    .prepared-section {
      margin-bottom: 1.25rem;
    }

    .prepared-label {
      font-size: 11px;
      font-weight: bold;
      margin-bottom: 0.25rem;
      letter-spacing: 0.02em;
    }

    .prepared-content {
      font-size: 11px;
      line-height: 1.5;
    }

    .prepared-content div {
      margin-bottom: 0.125rem;
    }

    .dates-section {
      margin-top: 1.5rem;
      font-size: 11px;
    }

    .dates-section div {
      margin-bottom: 0.25rem;
    }

    .file-number {
      margin-top: 1rem;
      font-size: 11px;
      font-weight: bold;
    }

    /* Letter of Transmittal Styles */
    .letter-page {
      padding: 1in;
      position: relative;
    }

    .letter-header {
      margin-bottom: 1rem;
    }

    .letter-logo {
      max-width: 200px;
      height: auto;
      margin-bottom: 1.5rem;
    }

    .letter-date {
      font-size: 12px;
      margin-bottom: 2rem;
    }

    .letter-address-block {
      font-size: 12px;
      margin-bottom: 1.5rem;
      line-height: 1.5;
    }

    .letter-attention {
      font-size: 12px;
      margin-bottom: 1.5rem;
    }

    .letter-re {
      font-size: 12px;
      margin-bottom: 1.5rem;
      font-weight: bold;
    }

    .letter-body {
      font-size: 12px;
      line-height: 1.8;
      text-align: left;
    }

    .letter-body p {
      margin-bottom: 1rem;
      text-align: justify;
    }

    .letter-section-heading {
      font-size: 12px;
      font-weight: bold;
      margin-top: 1.5rem;
      margin-bottom: 0.5rem;
    }

    .letter-conditions-text {
      font-size: 11px;
      line-height: 1.6;
      margin-bottom: 1rem;
      padding-left: 1rem;
      text-align: justify;
    }

    .letter-value-table {
      width: 100%;
      border-collapse: collapse;
      margin: 1.5rem 0;
      font-size: 11px;
    }

    .letter-value-table th {
      background: #1a365d;
      color: white;
      padding: 0.5rem;
      text-align: left;
      font-weight: bold;
      border: 1px solid #bfbfbf;
    }

    .letter-value-table td {
      padding: 0.5rem;
      border: 1px solid #bfbfbf;
    }

    .letter-signature-block {
      margin-top: 2rem;
      font-size: 12px;
      line-height: 1.5;
    }

    .letter-signature-line {
      margin-top: 3rem;
      margin-bottom: 0.5rem;
      border-top: 1px solid #000;
      width: 250px;
    }

    .letter-signature-name {
      font-weight: bold;
    }

    /* Page Header Branding */
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 0.5rem;
      margin-bottom: 1rem;
      border-bottom: 2px solid #1a365d;
    }

    .page-header-logo {
      height: 45px;
      width: auto;
    }

    .page-header-title {
      font-size: 10px;
      color: #666;
      text-align: right;
    }

    /* Page Footer Branding */
    .page-footer {
      position: absolute;
      bottom: 0.5in;
      left: 1in;
      right: 1in;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 9px;
      color: #666;
      border-top: 1px solid #e5e7eb;
      padding-top: 0.5rem;
    }

    .page-footer-left {
      text-align: left;
    }

    .page-footer-right {
      text-align: right;
    }

    /* Executive Summary Styles */
    .exec-page {
      padding: 1in;
    }

    .section {
      margin-bottom: 2rem;
    }

    .section-title {
      font-size: 16px;
      font-weight: bold;
      color: #1f2937;
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid #1a365d;
    }

    .subsection-title {
      font-size: 14px;
      font-weight: bold;
      color: #1a365d;
      margin: 1.5rem 0 0.75rem 0;
      padding: 0.5rem;
      background: #f3f4f6;
      border-left: 4px solid #1a365d;
    }

    .field-group {
      margin-bottom: 1rem;
    }

    .field-label {
      font-weight: bold;
      margin-bottom: 0.25rem;
    }

    .field-value {
      margin-left: 1rem;
      white-space: pre-wrap;
    }

    .empty-state {
      color: #9ca3af;
      font-style: normal;
      font-size: 11px;
    }

    .empty-state-block {
      color: #9ca3af;
      font-style: italic;
      font-size: 11px;
      padding: 8px 12px;
      background: #f8f9fa;
      border-radius: 4px;
      border: 1px dashed #d1d5db;
      text-align: center;
    }

    /* SITE Section Table Styles */
    .site-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 0.5rem;
      margin-bottom: 1rem;
      font-family: 'Times New Roman', Times, serif;
      font-size: 12px;
    }

    .site-table tbody tr {
      border-bottom: 1px solid #bfbfbf;
    }

    .site-table-label {
      width: 35%;
      padding: 8px 12px;
      font-weight: bold;
      color: #333333;
      vertical-align: top;
      background: #f9fafb;
    }

    .site-table-value {
      width: 65%;
      padding: 8px 12px;
      color: #00000a;
      vertical-align: top;
    }

    .site-table tbody tr:last-child {
      border-bottom: 2px solid #bfbfbf;
    }

    .site-narrative-section {
      margin-bottom: 1rem;
    }

    .site-narrative-label {
      font-size: 12px;
      font-weight: bold;
      color: #333333;
      margin-bottom: 0.5rem;
    }

    .site-narrative-text {
      font-size: 12px;
      line-height: 1.6;
      color: #00000a;
      white-space: pre-wrap;
      margin-left: 1rem;
    }


    /* INCOME Section Table Styles */
    .income-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 0.5rem;
      margin-bottom: 1.5rem;
      font-family: 'Times New Roman', Times, serif;
      font-size: 12px;
      border: 1px solid #bfbfbf;
    }

    .income-table thead th {
      background: #1a365d;
      color: white;
      padding: 8px 12px;
      font-weight: bold;
      border: 1px solid #bfbfbf;
    }

    .income-table-label {
      text-align: left;
      padding: 6px 12px;
      border-right: 1px solid #e5e7eb;
    }

    .income-table-amount {
      text-align: right;
      padding: 6px 12px;
      border-right: 1px solid #e5e7eb;
      width: 150px;
    }

    .income-table-percent {
      text-align: right;
      padding: 6px 12px;
      width: 100px;
    }

    .income-table tbody tr {
      border-bottom: 1px solid #e5e7eb;
    }

    .income-section-header td {
      background: #f3f4f6;
      padding: 8px 12px;
      font-weight: bold;
      color: #1a365d;
      border-top: 2px solid #bfbfbf;
    }

    .income-subtotal {
      background: #f9fafb;
      border-top: 2px solid #bfbfbf;
      border-bottom: 2px solid #bfbfbf;
    }

    .income-total {
      background: #e8eef5;
      border-top: 3px solid #1a365d;
      border-bottom: 3px solid #1a365d;
    }

    .income-spacer {
      height: 12px;
      border: none;
    }

    .income-spacer td {
      padding: 0;
      border: none;
    }

    /* Capitalization Value Table Styles */
    .cap-value-table {
      width: 100%;
      max-width: 500px;
      border-collapse: collapse;
      margin-top: 0.5rem;
      margin-bottom: 1rem;
      font-family: 'Times New Roman', Times, serif;
      font-size: 12px;
      border: 1px solid #bfbfbf;
    }

    .cap-value-table thead th {
      background: #1a365d;
      color: white;
      padding: 8px 12px;
      font-weight: bold;
      border: 1px solid #bfbfbf;
    }

    .cap-table-label {
      text-align: left;
      padding: 8px 12px;
      border-right: 1px solid #e5e7eb;
      width: 60%;
    }

    .cap-table-value {
      text-align: right;
      padding: 8px 12px;
      width: 40%;
      font-weight: normal;
    }

    .cap-value-table tbody tr {
      border-bottom: 1px solid #e5e7eb;
    }

    .cap-value-total {
      background: #e8eef5;
      border-top: 3px solid #1a365d;
      border-bottom: 3px solid #1a365d;
    }

    .cap-value-total .cap-table-value {
      font-weight: bold;
    }


    /* PHOTOS Section Grid Styles */
    .photo-grid {
      width: 100%;
      border-collapse: collapse;
      margin-top: 0.5rem;
      margin-bottom: 1.5rem;
    }

    .photo-cell {
      width: 50%;
      padding: 10px;
      text-align: center;
      vertical-align: top;
    }

    .photo-image {
      max-width: 100%;
      height: auto;
      border: 1px solid #ddd;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .photo-caption {
      font-size: 11px;
      margin-top: 8px;
      font-style: italic;
      color: #666;
      line-height: 1.4;
    }

    /* CERTIFICATION Section Styles */
    .cert-statement {
      display: flex;
      margin-bottom: 1rem;
      font-size: 11px;
      line-height: 1.6;
    }

    .cert-number {
      min-width: 30px;
      font-weight: bold;
      color: #1a365d;
    }

    .cert-text {
      flex: 1;
      text-align: justify;
    }

    .cert-signature-block {
      margin-top: 3rem;
      margin-left: 2rem;
      font-size: 12px;
      line-height: 1.6;
    }

    .cert-signature-line {
      width: 250px;
      border-top: 1px solid #000;
      margin-bottom: 0.5rem;
      margin-top: 2rem;
    }

    .cert-signature-name {
      font-weight: bold;
      font-size: 13px;
    }

    .cert-signature-credentials {
      font-size: 11px;
      color: #666;
    }

    .cert-signature-title {
      font-size: 11px;
    }

    .cert-signature-company {
      font-size: 11px;
    }

    .cert-signature-aic {
      font-size: 11px;
      color: #666;
    }

    .cert-signature-date {
      font-size: 11px;
      margin-top: 0.5rem;
    }

    /* Page Numbers */
    .page-number {
      position: absolute;
      bottom: 0.5in;
      right: 0.75in;
      font-size: 10pt;
      color: #666;
    }

    .page-number::before {
      content: "Page ";
    }

    /* ===========================================
       PRINT STYLES - Gotenberg/Chromium PDF
       =========================================== */
    @page {
      size: 8.5in 11in;
      margin: 0; /* Gotenberg handles margins, CSS handles padding */
    }

    @media print {
      body {
        margin: 0;
        padding: 0;
        background: white;
      }

      /* Standard page styling for PDF */
      .page {
        max-width: none;
        padding: 0.5in 0.75in;
        margin: 0;
        box-shadow: none;
        border: none;
        page-break-after: always;
        overflow: visible;
      }

      /* Cover page - full bleed, no padding */
      .cover-page {
        padding: 0 !important;
        page-break-after: always;
      }

      .section {
        border-bottom: none;
      }

      /* Keep content together - prevent mid-element splits */
      p, h3, h4, tr, .field-group, table, .subsection, .section-title {
        page-break-inside: avoid;
      }

      /* Prevent orphaned headers - keep with following content */
      h2, h3, h4, .subsection-title, .section-title {
        page-break-after: avoid;
      }

      /* Hide screen-only elements */
      .screen-only {
        display: none !important;
      }

      /* Page break divs */
      div[style*="page-break-before: always"] {
        height: 0 !important;
        margin: 0 !important;
        background: none !important;
        page-break-before: always !important;
      }
    }

    /* ===========================================
       SCREEN STYLES - Clean preview (no grey)
       =========================================== */
    @media screen {
      body {
        background-color: #f5f5f5; /* Subtle off-white so pages are visible */
        padding: 1rem;
        margin: 0;
      }

      /* Clean page styling for preview */
      .page {
        max-width: 8.5in;
        margin: 0 auto;
        padding: 0.75in;
        background-color: white;
        position: relative;
      }

      /* Cover page - no padding for full-bleed design */
      .cover-page {
        padding: 0 !important;
      }

      /* Keep content together */
      p, h3, h4, tr, .field-group {
        page-break-inside: avoid;
      }

      /* Page breaks are invisible in preview - just spacing */
      div[style*="page-break-before: always"] {
        height: 0;
        margin: 0;
      }
    }  </style>
</head>
<body>
  <!-- Cover Page - Matching Valcre Design -->
  <div id="section-cover" class="page cover-page">
    <!-- Top Logo Header -->
    <div class="cover-logo-header">
      <img src="${VALTA_LOGO_BASE64}" alt="Valta Property Valuations" class="cover-logo" />
    </div>

    <!-- Main Content: Photo Left, Info Right -->
    <div class="cover-main">
      <div class="cover-photo-column">
        ${coverPhoto
      ? `<img src="${coverPhoto}" alt="Property Photo" class="cover-photo" />`
      : `<div class="cover-photo-placeholder">Property Photo<br/>(Add in Cover Page section)</div>`
    }
      </div>
      <div class="cover-content-column">
        <div class="cover-title">Appraisal Report</div>
        <div class="property-info">
          ${propertyType ? `<div class="property-type">${propertyType} Property</div>` : ''}
          ${propertyName ? `<div class="property-name">${propertyName}</div>` : ''}
          ${streetAddress ? `<div class="property-address">${streetAddress}</div>` : ''}
          ${city && province ? `<div class="property-city">${city}, ${province}</div>` : ''}
        </div>
      </div>
    </div>

    <!-- Diagonal Blue Section -->
    <div class="cover-blue-section">
      <div class="cover-blue-content">
        <!-- Prepared For -->
        <div class="prepared-section">
          <div class="prepared-label">PREPARED FOR:</div>
          <div class="prepared-content">
            ${clientContactName ? `<div>${clientContactName}</div>` : ''}
            ${clientCompany ? `<div>${clientCompany}</div>` : ''}
            ${clientAddress ? `<div>${clientAddress}</div>` : ''}
            ${!clientContactName && !clientCompany ? `<div style="opacity: 0.7; font-style: italic;">Client information pending</div>` : ''}
          </div>
        </div>

        <!-- Prepared By -->
        <div class="prepared-section">
          <div class="prepared-label">PREPARED BY:</div>
          <div class="prepared-content">
            ${appraiserCompany ? `<div style="font-weight: bold;">${appraiserCompany}</div>` : ''}
            ${appraiserAddress ? `<div>${appraiserAddress}</div>` : ''}
            ${appraiserPhone ? `<div>Office: ${appraiserPhone}</div>` : ''}
            ${appraiserWebsite ? `<div>${appraiserWebsite}</div>` : ''}
          </div>
        </div>

        <!-- Dates -->
        <div class="dates-section">
          ${valuationDate ? `<div>Date of Valuation: ${valuationDate}</div>` : ''}
          ${reportDate ? `<div>Date of Report: ${reportDate}</div>` : ''}
        </div>

        <!-- File Number -->
        ${fileNumber ? `<div class="file-number">File No: ${fileNumber}</div>` : ''}
      </div>
    </div>
  </div>

  <!-- Letter of Transmittal Page -->
  <div id="section-home" class="page letter-page">
    <div class="page-number"></div>
    <div class="letter-header">
      <img src="${VALTA_LOGO_BASE64}" alt="${appraiserCompany}" class="letter-logo" />
    </div>

    <div class="letter-date">${reportDate || '[Report Date]'}</div>

    <div class="letter-address-block">
      ${clientCompany || '[Client Company]'}<br/>
      ${clientAddress || '[Client Address]'}<br/>
      ${clientCity && clientProvince && clientPostal ? `${clientCity}, ${clientProvince} ${clientPostal}` : '[City, Province Postal]'}
    </div>

    <div class="letter-attention">
      <strong>Attention:</strong> ${clientContactName ? `${clientContactName},` : '[Client Contact Name],'}
    </div>

    <div class="letter-re">
      <strong>Re:</strong> ${valueScenario} (${propertyRights}) current market value for the property located at ${streetAddress || '[Street Address]'}, ${city || '[City]'}, ${province || '[Province]'}.
    </div>

    <div class="letter-body">
      <p>
        ${appraiserCompany || '[Appraiser Company]'} is proud to present the appraisal report that satisfies the agreed upon scope of work with ${clientCompany || '[Client Company]'}. The purpose of this assignment is to provide the ${valueScenario.toLowerCase()} current market value of the property which at the time of inspection represents the improved property as of the effective date and leased up at market rental rates and operating costs for the property located at ${streetAddress || '[Street Address]'}, ${city || '[City]'}, ${province || '[Province]'} (herein referred to as the 'subject property').
      </p>

      <p>
        The subject property, located at ${streetAddress || '[Street Address]'}, ${city || '[City]'}, ${province || '[Province]'}, is a ${propertyTypeLower}, ${buildingStyle} property with improvements located in ${city || '[City]'}. The improvements are comprised of ${totalBuildings} total building${parseInt(totalBuildings) !== 1 ? 's' : ''}, and consist of ${totalNra || '[NRA]'} square feet of net rentable area (NRA) as of the valuation date. The property, reportedly built in ${yearBuilt || '[Year Built]'}${yearBuilt ? '; (' + yearBuilt + ' weighted)' : ''} is approximately ${occupancyRate}% occupied and features ${totalUnits || '[Units]'} units in a ${stories}-story, ${buildingFormat} format.
      </p>

      <p>
        Based upon our investigation of the real estate market and after considering all of the pertinent facts as set forth in the body of this appraisal report, as of the effective date, we have concluded the following:
      </p>

      <table class="letter-value-table">
        <thead>
          <tr>
            <th>Value Scenario</th>
            <th>Interest Appraised</th>
            <th>Effective Date</th>
            <th>Concluded Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${valueScenario}</td>
            <td>${propertyRights}</td>
            <td>${valuationDate || '[Valuation Date]'}</td>
            <td><strong>${concludedValue ? formatCurrency(concludedValue) : '[Concluded Value]'}</strong></td>
          </tr>
        </tbody>
      </table>

      <div class="letter-section-heading">Hypothetical Conditions</div>
      <div class="letter-conditions-text">${hypotheticalConditions}</div>

      <div class="letter-section-heading">Extraordinary Assumptions</div>
      <div class="letter-conditions-text">${extraordinaryAssumptions}</div>

      <div class="letter-section-heading">Extraordinary Limiting Conditions</div>
      <div class="letter-conditions-text">${extraordinaryLimitingConditions}</div>

      <p>
        The report has been completed in accordance with the Canadian Uniform Standards of Professional Appraisal Practice ("CUSPAP") adopted January 1, 2024. The full narrative appraisal report that follows sets forth the pertinent data and analyses leading to the conclusions presented herein. The appraisal requirements section of this report sets out the basis of the appraisal, definitions and the valuation methodology and must be read to gain a full understanding of the process.
      </p>

      <p>
        If there are any specific questions or concerns regarding the attached appraisal report, or if ${appraiserCompanyShort} can be of additional assistance, please contact the individuals listed below.
      </p>

      <p style="margin-top: 2rem;">
        Respectfully Submitted,<br/>
        <strong>${appraiserCompany || '[Appraiser Company]'}</strong>
      </p>

      <div class="letter-signature-block">
        <div class="letter-signature-line"></div>
        <div class="letter-signature-name">${appraiserName ? `${appraiserName}${appraiserCredentials ? ', ' + appraiserCredentials : ''}` : '[Appraiser Name, Credentials]'}</div>
        ${appraiserTitle ? `<div>${appraiserTitle}</div>` : '<div>[Appraiser Title]</div>'}
        ${appraiserEmail ? `<div>${appraiserEmail}</div>` : '<div>[Appraiser Email]</div>'}
        ${appraiserAicNumber ? `<div>AIC No: ${appraiserAicNumber}</div>` : '<div>AIC No: [AIC Number]</div>'}
      </div>
    </div>

    <!-- Page Footer -->
    <div class="page-footer">
      <div class="page-footer-left">${fileNumber || ''}</div>
      <div class="page-footer-right">${appraiserCompany || ''}</div>
    </div>
  </div>

  <!-- Executive Summary Page -->
  ${execSection ? `
  <div id="section-exec" class="page exec-page" style="position: relative;">
    <div class="page-number"></div>
    <!-- Page Header -->
    <div class="page-header">
      <img src="${VALTA_LOGO_BASE64}" alt="Valta" class="page-header-logo" />
      <div class="page-header-title">
        <div>${propertyName || 'Appraisal Report'}</div>
        <div>${streetAddress ? streetAddress + ', ' : ''}${city || ''}</div>
      </div>
    </div>

    ${renderExecSection(execSection)}

    <!-- Page Footer -->
    <div class="page-footer">
      <div class="page-footer-left">${fileNumber || ''}</div>
      <div class="page-footer-right">${appraiserCompany || ''}</div>
    </div>
  </div>
  ` : ''}

  <!-- Table of Contents -->
  <div id="section-toc" class="page exec-page" style="position: relative;">
    <div class="page-number"></div>
    <div class="page-header">
      <img src="${VALTA_LOGO_BASE64}" alt="Valta" class="page-header-logo" />
      <div class="page-header-title">
        <div>${propertyName || 'Appraisal Report'}</div>
        <div>${streetAddress ? streetAddress + ', ' : ''}${city || ''}</div>
      </div>
    </div>
    ${renderTableOfContents(sections)}
    <div class="page-footer">
      <div class="page-footer-left">${fileNumber || ''}</div>
      <div class="page-footer-right">${appraiserCompany || ''}</div>
    </div>
  </div>

  <!-- Additional Sections -->
  <!-- Exclude data collection tabs: client-intake (S1), loe-prep (S2), image-mgt (S3) - these are input-only, not report pages -->
  ${sections.filter(s => s.id !== 'cover' && s.id !== 'exec' && s.id !== 'home' && s.id !== 'custom' && s.id !== 'client-intake' && s.id !== 'loe-prep' && s.id !== 'image-mgt').map(section => `
  <div id="section-${section.id}" class="page exec-page" style="position: relative;">
    <div class="page-number"></div>
    <!-- Page Header -->
    <div class="page-header">
      <img src="${VALTA_LOGO_BASE64}" alt="Valta" class="page-header-logo" />
      <div class="page-header-title">
        <div>${propertyName || 'Appraisal Report'}</div>
        <div>${streetAddress ? streetAddress + ', ' : ''}${city || ''}</div>
      </div>
    </div>

    ${section.id === 'home' ? renderHomeSection(section) :
        section.id === 'report' ? renderReportSection(section) :
          section.id === 'assignment' ? renderAssignmentSection(section) :
          section.id === 'site' ? renderSiteSection(section) :
            section.id === 'tax' ? renderTaxSection(section) :
              section.id === 'zone' ? renderZoneSection(section) :
                section.id === 'hbu' ? renderHbuSection(section) :
                  section.id === 'recon' ? renderReconSection(section) :
                    section.id === 'income' ? renderIncomeSection(section) :
                      section.id === 'sales' ? renderSalesSection(section) :
                        section.id === 'impv' ? renderImpvSection(section) :
                          section.id === 'photos' ? renderPhotosSection(section) :
                            section.id === 'location' ? renderLocationSection(section) :
                              section.id === 'market' ? renderMarketSection(section) :
                                section.id === 'calc' ? renderCalcSection(section) :
                                  section.id === 'rental-survey' ? renderRentalSurveySection(section) :
                                  section.id === 'maps' ? renderMapsSection(section) : `
    <div class="section">
      <h2 class="section-title">${section.name}</h2>

      ${section.fields.map(field => {
                                    if (field.type === 'image' && Array.isArray(field.value)) {
                                      const imageUrls = field.value as string[];
                                      return imageUrls.length > 0 ? `
            <div class="field-group">
              <div class="field-label">${field.label}:</div>
              <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; margin-top: 1rem;">
                ${imageUrls.map((url, index) => `
                  <div style="border: 1px solid #e5e7eb; border-radius: 4px; overflow: hidden;">
                    <img src="${url}" alt="${field.label} ${index + 1}" style="width: 100%; height: 150px; object-fit: cover;" />
                  </div>
                `).join('')}
              </div>
            </div>
          ` : `
            <div class="field-group">
              <div class="field-label">${field.label}:</div>
              <div class="empty-state-block">[Add images]</div>
            </div>
          `;
                                    }
                                    return `
          <div class="field-group">
            <div class="field-label">${field.label}:</div>
            <div class="field-value">${field.value || '<span class="empty-state">—</span>'}</div>
          </div>
        `;
                                  }).join('')}

      ${section.subsections ? section.subsections.map(subsection => `
        <h3 class="subsection-title">${subsection.title}</h3>
        ${subsection.fields.map(field => `
          <div class="field-group">
            <div class="field-label">${field.label}:</div>
            <div class="field-value">${field.value || '<span class="empty-state">—</span>'}</div>
          </div>
        `).join('')}
      `).join('') : ''}
    </div>
    `}

    <!-- Page Footer -->
    <div class="page-footer">
      <div class="page-footer-left">${fileNumber || ''}</div>
      <div class="page-footer-right">${appraiserCompany || ''}</div>
    </div>
  </div>
  `).join('')}

  <!-- Certification Section -->
  <div id="section-cert" class="page exec-page" style="position: relative;">
    <div class="page-number"></div>
    <!-- Page Header -->
    <div class="page-header">
      <img src="${VALTA_LOGO_BASE64}" alt="Valta" class="page-header-logo" />
      <div class="page-header-title">
        <div>${propertyName || 'Appraisal Report'}</div>
        <div>${streetAddress ? streetAddress + ', ' : ''}${city || ''}</div>
      </div>
    </div>

    ${renderCertificationSection()}

    <!-- Page Footer -->
    <div class="page-footer">
      <div class="page-footer-left">${fileNumber || ''}</div>
      <div class="page-footer-right">${appraiserCompany || ''}</div>
    </div>
  </div>

  <!-- Appendix A: Contingent & Limiting Conditions -->
  <div id="section-appendix-conditions" class="page exec-page" style="position: relative;">
    <div class="page-number"></div>
    <div class="page-header">
      <img src="${VALTA_LOGO_BASE64}" alt="Valta" class="page-header-logo" />
      <div class="page-header-title">
        <div>${propertyName || 'Appraisal Report'}</div>
        <div>${streetAddress ? streetAddress + ', ' : ''}${city || ''}</div>
      </div>
    </div>
    ${renderLimitingConditionsAppendix()}
    <div class="page-footer">
      <div class="page-footer-left">${fileNumber || ''}</div>
      <div class="page-footer-right">${appraiserCompany || ''}</div>
    </div>
  </div>

  <!-- Appendix B: Definition of Terms -->
  <div id="section-appendix-definitions" class="page exec-page" style="position: relative;">
    <div class="page-number"></div>
    <div class="page-header">
      <img src="${VALTA_LOGO_BASE64}" alt="Valta" class="page-header-logo" />
      <div class="page-header-title">
        <div>${propertyName || 'Appraisal Report'}</div>
        <div>${streetAddress ? streetAddress + ', ' : ''}${city || ''}</div>
      </div>
    </div>
    ${renderDefinitionsAppendix()}
    <div class="page-footer">
      <div class="page-footer-left">${fileNumber || ''}</div>
      <div class="page-footer-right">${appraiserCompany || ''}</div>
    </div>
  </div>

  <!-- Appendix C: Qualifications of the Appraiser -->
  <div id="section-appendix-qualifications" class="page exec-page" style="position: relative;">
    <div class="page-number"></div>
    <div class="page-header">
      <img src="${VALTA_LOGO_BASE64}" alt="Valta" class="page-header-logo" />
      <div class="page-header-title">
        <div>${propertyName || 'Appraisal Report'}</div>
        <div>${streetAddress ? streetAddress + ', ' : ''}${city || ''}</div>
      </div>
    </div>
    ${renderQualificationsAppendix(sections.find(s => s.id === 'cert') || { id: 'cert', name: 'Certification', fields: [] })}
    <div class="page-footer">
      <div class="page-footer-left">${fileNumber || ''}</div>
      <div class="page-footer-right">${appraiserCompany || ''}</div>
    </div>
  </div>

</body>
</html>
  `.trim();
}
