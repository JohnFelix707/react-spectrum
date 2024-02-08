import React from 'react';
                    
export default function pencilAvatar(props) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" {...props}>
      <rect width="16" height="16" fill="url(#pattern0)"/>
      <rect width="16" height="15.999" fill="url(#pattern1)"/>
      <defs>
      <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
      <use xlinkHref="#image0_19100_326" transform="scale(0.0078125)"/>
      </pattern>
      <pattern id="pattern1" patternContentUnits="objectBoundingBox" width="1" height="1">
      <use xlinkHref="#image1_19100_326" transform="scale(0.0078125)"/>
      </pattern>
      <image id="image0_19100_326" width="128" height="128" xlinkHref="data:image/png;base64,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"/>
      <image id="image1_19100_326" width="128" height="128" xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAACXBIWXMAAAsSAAALEgHS3X78AAAgAElEQVR4nOV9CXQc5ZXu91d1q1tq7YttSbblFWNjY2MICMKW9SVkgSHbDDAZkpwwnOEcwpnJ8iZ5M5OQyfLykhd4eZCdZM68kJCFQAaSTN4LMYQEm4Bt2WDjXfIuW1tLrd6r/nfu/f+SWq2qVner1WqRz0dHcld3dVXd+9/93l9IKfFqQk+3vQIA/VwPoBHAFn179Lshz1sNA9it/6bfIwC2AejdvN3ofTU9rwXPAD3d9vWa2NcXSORi4TDHtqW3fDrWcve9/32Ov29OseAYQK/wm/TPdfN1Hes+eguCvjQkJGx/Ip2M1e5PRJrubbz96z+dr2sqBguCATKIfjuAzfN9Pev+8WYEAlGIeD2kPw5IQKSDkEYK6a69dvL02pdT57vubXz/tyqeGSqaAXq6bYfoN1bA5TDWffx9CBrqmUkzBdgGIA3AsGC39UJEmiHidXw8tehIIh6tf7L+dX981zxfticqjgF6uu1GTfR7AHRVwCVNYN0n3oOgEPxfKazJAwb9Ta9LwDaB4Dhk9SiQroKI1UNKgbiw9iaGlt/W9Nff2DO/dzEVFcMAmvD36J+5NuQKxtovXIPq0UVMXMTqABL96QCEFJDCBsw0RLoKMhiBrBtQx8ZamAkQGIe9qB9G15th9afD8bOxG2rf8OAfK+G+5p0BKp3w0GI/4E9C1p+HMdxBZh8EDMhARIl/KClAop+ZwZeA3X4Ixul1EOkApM+A6F4P1Ojbk3Gkhl4Jx3t9N9Rd89C8MsK8MoDW8fdVmqjPxLqPvxcB0vm+JJD2M+HB+j8Ju+UkSwLj9IVAVRTpC5/lFW/2bYYRaWFmEKYfeM1GoC407dzSHkbs4N6narY+9ob5uj9jPr6UrPqebpsCKz+vaOJ/8i8QqEpAkH6XQut5sK6XwXGY51bCOLsGQhqQdYMQ0Qb+m4hPYOJffpEr8fks6SPwL/mP1yeONqSGn3jbu8t4axMouwTo6bY/DeBfyvqlRYD8/ACtel+KnhLrdoN0OgSkLw7YPtb1RngxxwJQHYH0JdjoY0nh08SvrXX9cjv5AqzoI1NeS55Z0xe69MCKct5n2SSAXvW7Fwbxb0WQCE8MQCBDrioG6Y9BBseYKazVzyv9LiTsxUeBRDXEWKuy/H1VSux7ET/x4jTiE6raD3cl+2qsckqDsjBAT7d9uw6fznsQZyY4xGe5WBVn0U+WviDLX5ps9FntByFiDRDjTcr4o99CsoIQPh/wGm+xb8d3wYr9yPMqhD9h1F7ynz8Ze/bSp8txv3OuAnq6bTLyPjKnX1IiTKx8DWmknT9Y77Ou9yeY2MwYqSAbg2wf2D4t9jcUJPZzITWw/HzNxccWzeU9zxkDaPdu20JY9cgiPhOVVjSLeAtCmhzYoR8y9GRgnN9nhJeo6N/AMggzkHPly/ABpOV3Cr4umQrYkV3/ZUvzTT/fO8tbdMWcqICebnvLQhH5cFn5wqpSxDdTkHVD/BrpfxFpgvSlWNeL8UY2Bo3zK4CaFHDFOk/io/80rOH/KOraSCXUXfbknpFfvfkTxd1dbpScATTxt1Wye5eJpe/93BTiO7DrzkM29KtoHjFA/QBgWsQdKvRLqsD2w24chdhyGRByj2HJsf1IBb4K2dhf/EUaFuqWHP1i+JHbSs4EJWWADOJXZEQvG0T8llU9U16lKB+tdmOsDcbQUn74JAnMkxfxcTYGiQHSAcBvwNjUDYTqXc8vB3thDT8++wtN+yCGOxC65FdfHPnZe0rKBCVjAG3p71qIxJfIyO75k0AqqN8lISw/G3nW4iNAMsgxf8oAyvoIcMV6oLrR9fzs6oUfhawZLe4Co5qpEtUwBpYr+2OsDfWLj31x/NF3l8xDKAkD6JX/vVKcqxzIXvkU6eOwLRGb0rtCThxxYPSvUt6AbcJuG4C46GqIYLPr1bK1H/sRZPMZFUgqAiJey8lFBGIcdRTRRhhn1gCxBtTUDl8bfuTWkkiCWTNAhthfEOh837+iZZUq91MrX7K7J3RShw1AOflYqMiDU7w+cv9syBoLxto3ehPfI8hTEFJVOrbAeWeYfRcDlHgiVk0GIaviqLn0l1+M/PrvvjDbZz4rN3Ch6fxOWvlrXmSC8qqvDkNSICdWD2H7PD/HWb9EDRCUEFsv8fbzY7thJX5Q/AVKcAZRBqKQoRGYfZsgkjXq3IuOsgdinlyP9MbfwSfugGjsxHhP3/8KXf1g0XGWoiWA9vMfW0g6v5XEvia+HRoCDJsJn4v4jFSAw7vikq3exI/umR3xoUPOxAehYYh4aOLv9IanYfSvhnniIthLDsOfuhuiZQVg+hHasPTuyJMfv6rYr5zhznNiQbl6jtiHruYxxpUIn4j2TR6dovsJwqjOHd51Vj5FBI3iJapI1MBuPTFZWxAch935CtseFHwig9JsvAlYsmTyQ8EgQq81/zDtovNEURJAh3cXRJCn87Z/YoPPITSL/lBY6X7K3pF+11DvyXqOM8X2Ey9Dyk74Wn8Hf8cg/B0W//gWH4XZ+D0YwRnKGdM+ZfHTiifvoyoKY3CpMjaX7mPbQ4w3qGzksquBJe3TTiGq2pDe/7eRYp5PwTaAdvcWhMXf+b7Ponnz/4MY1eF0QwdxpAFhOcJPTDJHtiqYgfgyYUM03AEY7nGAifelemCNfBAytXvqAfI4bAPGyYtgd+6H2bsFMFOwlr/EBqcY6mTrny99zRaI0Cb3LxgbR/rcw4ida32m7g2/L6hUviAJoMuz7yvkM/MFx9qnhA2oQJNKtYj4RHjy4ynHTz9sednK0teeARd8zkB8WLUQTR+dkfjgcO5m+NpehFHzN1MPJKthnFoP2XKSI45cT0g1h4YFs/cSmFRSRnGAtTmIPz4Ge//vAWMMIdO+duQHHywolVyoClgQRh8Rv3XlHiXOk9WQphbtToEHg4r5LfWbIm2O6CcmqRK5iZ+uB+ruKPi6zMaHFBOQrWCZXE5mLzrG3givdGnAbjoNMbIYggpN/AmICzZD1HgQPxKBfej/Uo5ZXfpIO2q79hbkg+atAhZKJQ/p/NalB9TK5lVvqwreeEjpfzKwqJqHXrMNFfzhKh/l50PWQnjU8BFkchyi8Z+Kv0A7jPT5rZDpPhVpHO7gIJO1ogciWs9Fp5Rostv6YLS+BWLRMvfzRMOQf9oLkTA4I0n3S58lCRe3zb7qv/hpXpVFeUkALforn/i3/jNauvaqqB79owIOWtEUVeMFLrTRJ1k1UNAHOh7AyR2fH4LCu54p3YMQtX8/u4s0GmDU/QvHFbiekBpJLD+McBuvYL5euraVl3sTPzIGuXMnREJAVkWBaAOMoU6l3swUgoFo18j378xLFeSrAr5fwC3OCzjIs2y/KszQBRwM8uGhqnoo0eOAmIT1vX7gSDdAbN2SI7FzFBhZDvg81EIBIM+AagmRrOGQr914FnbDOaUW4rUQG9bBqPZwsmLDkC/sBdJpdQ8UMyCbhj4fjHAY224+hdpFfT/M54pmZABduj1vTZj5wAnyCKc7B5NqbfI1BTs0oiQEMQmndAXsjpPAVWs9iY8z/ZAHXoKou3zaoXNn4vjcx17COy/fNvHzyTt34+jBHF4ZSQG8BbL5FOyOA8ykJA340KrLgI7F7p8jsb9jP2TdCVYZDFJhFEAydcjasGCc74KZDvgiP3z/z2Z6fDkZQEf7Ktrq78zM6lElj+Gs8kl/nla5Y+1zhM2REKkA7M4TMFa/GSLQ6v4F/acgD+yBEWkFaqYShoh8960vYMfTA1Nef2nnCO657QXsfXHE+8KbN3MpORt66QDM8ythLLvG1c9nkLX/0nOQdceVvSLV/dH9yNphlcmk/sRFx5QqEDZqGgZuHnnoLg8LUmEmCVBx/XmZ6Hz/Jzm2T24bPxTLz/qUW7brz/EPMwWzg6HCvpTsIfLT+6sEjDVvhvB7rLhzJ2CfeBbW6hdUrMCwphy+/zOvIBrJjiRmHL/3Fc9jRHwyTCm2L4bbgc0rgHaP6xiLwH75DxBxASRCMM6thHl8E+xFvUr0axXAwaITG9VnqKTNNhFoPZWzFMmTATJatioSnX/zX9Hwlgc5acKgcmxO61pcuUOvy8azvBrY6mf/nrJ5I+z/IyAgLt0MEWhxJ9DgMdgn/gir4yDbFfbyvaokXINW/7FDuYNvpB62Z0mHCZD6ITpRM8nGtcDiDvfrSAxA7toJpFOwlu5jonJxKun+aD3EwHIW/xTsMoY7J0PZHO8wUS3Qdf4rn1vldY25JEDF9uqRq9fwxu/wTcqasNb02sgjFVAV49y5cerCiVYu8KIwuLFTmFUAGXw5Cjjt87+GpIRRVUz1+tWfy1AvJJG9V34mjnnYAuJYCL5910Gs3QJ0uBf+ylQ/5N4dAAsxCTHaytfP0oibT1tVbCMRgojVciUT1Q+wpPIlmfHjiWqc/sk/vt/r+lwZoJJXf+cHP4qmK38GY7SN8+Rk8BDTcylX3aDyiX2qnUu5eSq651gETvWuqG5yPb+MvAwr/Bjsxcdgt5xSr1EVcDAKO1Z4eVeo1iPfNrQH2LTaU+fL+BCwYx/ESC2s1X9SSoxK1CioRaHsSLMOYgXUfVH9AHk8lLbWJevxtA8HvswZyns0TafBSwLcXomrv/MDH0Pz2uc5OUIPQySrgeCYKrikJg5/UvnWY60srjN7+NkPoPBuLj9/bB/S0R/q9u4qLszg6iBfWjFZ+DcT713cEXQ9RzY2Xury3If2AiubINqWu19H8hzs3ieAhIDVtYeZXLWcVSmrX4e1rQueU4WryRpIklTVY6p0TJqIp6tw4MsPO6ds0DSdBi8GqLjVT8RvfO0jbOyIkQ4V3CHd3HBeRfrIABzqUOKPHgJN6dCVPURQe2kf0H0BEKpzPb8cOop09EdKNwtw5Y3622JXkVfdUAz2mHqoi9qDeMdfLs15zRu3NmLVBdPrB6T9iDfxE4Ow+54AYqZSP7S6qSiEYgTs96sydb7faIPqW9T9Cly0kghlrvxMuNJ0GgNov7+iLP+OO+9C86pdMI9dCuPERao8y0zBbj4J2XhG1emT0eNLQNYOcVDFiQayh9A6BHP5O4Aa7wLOtPF1tdpJpNoUHRxTonRkCT9UfripAOTh+wBLGYO3fHgFrrjO3X1cubYWn/ofG6cfGP0ORI17OZnS+dthnF6mAlehYU4IOYYuMTJHN20TsnZQ2T7D7Rw65ms3bCSmrvxMdGnaTsG0XEBPt/1YJc3k6fjbu9Cycg83Zage/cBEZS5n+tj4kywKyQ1imGnVsJGugr38CMzlN3pX70Z7YMUfhgheo3QouZFUkhXbBxjnldFIr5OYDQ2z0SmqtsDX8hQHdAhk6W/fNsBWf6jOh+7rWvGGty+Z/mXjPwXEcdfrkNYZ2MeehHF8lWI+HcBy+g8dL4eZnty9fm3YOyXqVEBsmTjwpZy5oMc3bzemMMEUBtAx/2O5SVI+0MpvuvxxmIcvVw+eVrl2b+ghGaTr6WqqR1WHruWDcXIDZOtxHt5gDK2FseZNQK2H2I9GIWuWw6hxN5Jlcg/k4Hchjz/FdgbP/dHZROHfwtk9SvXmheFv8qgY1+9J9cM6/jjM3nWwqfGUJE7aD2vlTpiHr2BVwO5itBHWkkNsAIPqGCdmFkjE036vlZ+NlZnDLrNN1GkiYr7Q+defYrEvjlymVnd1BIjVspijTB6tAKkDM5TuFYNLVSk1PWRaLaNdMNa+wVvnGxshWt+cs45KVF0M0X4/ZNM+WEP0aAYziLabs3qU3jVCH/FkBDn8O4jkM0Cd+3VQSlfu3wkzvhx263GthvyqLIzcu0RINaRSWhsS5tm1OuKZhiQ7gIlf5abzvXBTZnQ3WwJURD9fxx13o7XzACQRu6GfDR7K2JmnNqgqGn+cw59icBnrQprdI0batVFkA0ELuHSLt6tnXg4RuLqwi6I07uDrp1f1aAhzBeCbajrJkRfhC94K0bTG/Trig5AvPwtZpeINZG+QyOcgT6JG9SFSM2pomN+vqoMUvRwXN24DB77040LupGfzdsMZnzvJAJUi/js+fDeaL/kNjDNrWeyyZU8E9yd5hVN0z64d4t9UOMEtWxT0oAAJPRy/CfGaTZ7VuxCbgOo3FXVt0urjVQ87K8YvJySx/g71y6x5H4yqy9zPlTwPuftFCCpLWNSrmJeifCTFyOCk6CVFMm2D4/uU7rXrBmGeuUBJBSONWNMpHPrYjmJuZUINZHoB8y7+KZ/fvPHpCauWy6TqzytRTwYeJTvqz0HQCJZEjQp6cLFHrQrWEPHJz/cgvrSjRRMfvMq7YNZ/dfIFp65wIsoElVqWAr70Xd7Ep/Du/mcgA+eYqI5/T748EZbsG9lyAnbDWTZI2eBLBVUKmTqWhYVYaLBY4iOT1hXDAJ0f+Ciat/yGEx1UF0c3zg+G4/ZRZRS1H1QPwbBhHnmNEonaGLIXnYO4YoO3qxfdA/iun/V1ksHI4l4qb2MaqJG05i8hWj0KciJjEH84CtG/mA1Xg9w4Kv+i8PXAMq4PhG4E4flDjWd0i7qAGGtWfr6ZwqFPzao9cILWmUbgvOX8Oz70D2i+YIfyuTnM2aQCuER4CshUj7G+Nyjf7U+oFZGs5kggET+9/kWYbbcBQY8W7ege2Oln4Qu617VQ2pZSuATy692CN5kQwRshI/dPbSHQf5t174ZRtdX9g2PjkC/uofFggM+G7/Br2IWz1+6AIMueDdwEBLl52o2lUTQcj6B5BMExxJpP4fBd+4t4ylMwQWtmAD1yfV5ABl/Lsn2K+DSFg6Jf5OZRxG+4g1eJeepCyKYzyvqnhAi5P5T/pmRQAPC1vh8IegV5dsIe+hVE6O3TjlFG7/Mfe4n9dwc//HYvR/AoiEM+vRsM/3tgx76nqo0dJhC5dT5iI5B7dkEkA7AbhmCEF0Fy3l7COLdKGbe6LpHsAa4JjDTBDkS4Oxg8blaWgvhwaL55u7HNUQHzwgBUydPWfIYtX3vxERW/r4rybxFexH4wdcPYFOtnw8hULhEtOGKW+ijEZZu8gzzxnbDG1MBuA1dMOUZEp8qdTOI7IGlAxzwzfsKaSOc6hRk5iU8rf/t+IGboYg4aQDHAUUs6F0fzoqr5g9QaRTJ5GkkoDPP4xbw4ElLg0H/7bUHPdwZcjwwboOwMUL91H5qvPaEMZ257Cqtih/BitoStFbthnr4AxrkVarWEhjj/zV7AksNcwGlsuNpzMge3a408zg+Up3zIqR7/w9/qzVnMQbn+3z5x1v0gR9/8SmzPRPxoGNbxX8Du3MmuK8fzm87Abjmhony6H4GKTih/wcks6hTSregk6VKBKA58YcbqrkIxhQG2lOy0eaJm0yjEhguB5U2wlu9l4w9cqZNUPj5JhYZzHPUiZhDjqnqWjouxZTDWX+Od1YvuhRV7WPnWsVo1sdufnPIez0KNfN5DARjKx1NKuuavvK39+BATn8q4KMzMswZpoiiVgpOB13RG1SyS+Ceik5Tj8K9iWpKCti+JI18rfLhUHmCa+7T/X/bUb2iLsnbFhRtg9J8GqoaU+0dDGJtOw3fwKuXa6Y5ZbpasHYRINcO48HU5WrR7YIUfh7Aa2LrmZsu2PgiTCjEnu6hzrf4ZkTrO10q9eiK41vXdMn0Gdt9/wm4+wrkECvGSYUcxDLb8KVuZDHJFMKk8s3+1nkxWNWFZWr4EDv7P/4PkkHu10CzRQLT36Q2WygqzNoHazScnvtJY/EbYvidhDx5if9d3qJtLt5gZOg5wazRH/BoiMFbeAFTl6M8fp6hYkMepSKri4QYQEzKxjaN5TgKnptZXNBPYyadhtL8OosGd+IiOIB39DozYSohQtdLtdD3U339mLas6J9pHs4gkMhNHivi08g8++PW5Ir6DFcZ86P/aLSenvWa0vA1YtFTF+KlaNjQMq+MVld5dcgh2+ykYXW/nTlg3MPEpqzeyRDVJUCWwnvTJ+pQyg/HJip5ujzRuJlwzetYYDMpENqxz/9DYOOz9z6iULol9SlCd72Jbhjp/OcLHiS3/RERPZPyDJv6BBx+ca+ITrjf01mplRebqz4TZeCPkOh+sZS+prBsFWigH7/fBXHQLRNC9gJOIbw8+OTHHh0Sq3dqn0sckasllpL670XuVFADw4b9fw1LAC5TPd2MAGXkQom61+6eoaaPneYixajbmVEArxkkee8kRVf1L98S2Sb1iTjE1HV9G4hMajfkwAEMuEsCB0XkNfNF3cFTMPL6Rw7u+5ts96/bJz6caPhqe5OzWQcaVagW3gZoRZa1T6bTVCyusWrvIx//8N7awz58NCgbRsWzI6Hch/H7X66DETvr0T4Ck4FQ0W/VUR0CZPdtkNUZla9aKXRz7p6imahL1TZSul5n4hC2zmRBSFEj/V68+n/OjYsXlsBp/Adt+Bb66Oz3r9u3ki7BGfw6RVhFBDqw4q4qMKWceAGUIbXXMjvw7W9pm00Mc8SNCU0DI8fmp1o/KvaZh/AcQIux6HRzb3/MijHQ77KZTE4RlNUTBomS1mvFTParcPApfk5oy0xzzNwaXzwfxGb5yS4CGq4/k9T6z8Z0w0q+H8HkYfDR1O/IzVR9YE1ZlU9zx7VexBaHdNUqvUtCGIow8B8CAPfITYHwQxpKvQfiW5w79WmOQ0W9AmKbrYZk+C/vIbyEEVeQ2q+IUmkBCpeT0vZYP5skNypgd6OJSdSX2qYrpLKsIqyqKg//7W2UnviMByuoChjz0vxu8iM9+fvxHEPGGSTFK1j43R+osHVX0kvVPuXSno4dEMvnbSZrF8wTkoechWm+EqLuBCzoo2zf5Hc9BRn4JIQYgQh6uXmwYeOEAjFQHq570+mdU1S55MCT2qZqX5v5QuxZ5AjQBRO8wxjUMiVpYgRgOzw/xCQ1lVwFuHkAh4CGM8R+rLuCRJZO1gBTokXrmDo960fkCCthEVGEIt09R+DU9zkxAbqJMfhsY+vbkFVCpue4j9Mk7Ido8XL3IGLB3J5UGQdZF2NCjiKVN9gd9OxWqjrVyWbd5bCv38DHBFx1VgZ7RNtg1Izh875PzRXxGWfcMqloyiqrFRY5O1da+7N0BJGpV6pTav0j0k7VPpduk97WuZ2kQjAK0ywdVFVFQiUQvBVuoqSJjOhiVk3GkjpjHr3IDZu27INrc+/NJ51tnfgpphHkTCZ7gRTWDVTGYJzaw2uHxroEofAevVCXmqSDn91kSpAKwWk7i4Ff/HcnBzqKfRylQVgnQ8Nr89L8noqdUGpiyZM2nJwY+TcT5uXVLi3tKoYbbVCyAjK3aETWBM6pKrtReQIAYItcsqTJxUo2J9YXeCxH0aKolsb+DxP5a7he0xWkOVxtnV7OBxzn+voshqV8h7Wfm4K3miLH0FjRWTRiHvvDovK58B2WVALncv3xAwSLRulI9SF0azuLatHTxiK2YgapyKOlCnbOcshVqUwcqG6Okk5nSFUfNijloFDyU92AGbvMcyMRlXNtfgdW5i9u1iKhCD5amvH1602/1NHE1loarlkbbVEUTN650AgPLcehLP573le+grBJgtvqfYCx5HeT4AOTYqGqEZNEdUHn0SJNKp7b1KlWgmyg5BkCrntSCrQxEzi2QWiAJQZm98GIYHdd5TuYgsY+dPbDbD6umDJo1ENNGKqmB4LBK5lAgijyB2kH4zq5WjGXrgVCB8bmM7ReFsjFA9ZrzMEOJkpzLDL1HRfZSuiauKqrqB6mhgyQDSQKe/F3FY9YoBs9lZcBEuTX35zs1fTSjp/1677EsNJnjpRcA22ImM0kFtR5nZiMXU1ItA0kRcjHJuo/Vwzy1Xkkqnh6ahl0Vqzjio5wMMGv9nwUy0jAmYFsvcF0gd9OQNNB9gqzPqZqY/p5oyFB1dZyXJzEtkkw0X927PUexUUqXgjyy7pSaNUATOWiWHxl1zafUXsLkfVB2kGL+ZFASU9B363AEWSYH7/u3iiM+ymkDzFb/u8GsuxmGeSV3CDNB9Vx9Tiuz+FcbN7MI5sZJcv0G1bFoHf/frP4rb+Kn+oE/HoSI+thl5PPShBGH0RzGIpeUJ5HpPgayOSItPI+YnBPO6lWIzs9G2SSAVwJotjCb3gGMx7jHj3d4JbdQTwlB2lCTuGjGPr9uq2ghlV/5UvBR9W71evcrGB8D/nQEsNOQTWe5KHWibp/iCouPQAx0cRQSUN3E1D/IhiUZmBR2ppTu175dkSvfATFAeK6jgfmGf4uFSW7b4FJY5lNqty9n5JoelcIiW+jpHmS1Rxtgdl4HUeNB/LEI5J/2Qdad5qIN6VNbw5PtQLP6yWWkuf4MGjrFo2cozr924jus8uTzZ4uwT2/vNqcl4XO1+jNhLL8KMnJ60jDkVqp6FflzQsF6BRtLr4FRfbH7iahXb2cPZM151vEUcOJzxWo5pEul6JJEPJdx611DSR2cqVb/t/yw/HEcfOCblU58wu6yqIC50P9uMGvfDYzb3O/PnTYNOuuYUq4g1dgZXVfCCHjkv6h6d/dOWMvUriLGUAczEHcgWX4V5BlYDkEup441sB2Q0LWJ5Jnwyv/GQiA+Y84lQD7p35J+H6mDRAhW1baJoczcaEkzA5a/FkbgEvcPciXP72F39ag6fCrY4OhdCtI/DIs2biAmciqMHQMTukrYH4flT+DQlx9eMMR3JECOaYazx1zrfzcYzW+DHI9CjhzkSSFkB/ga3wkRdJnYAb3ye/4EBEcnw8o0gaS1DyJVDbuhX7l4py9kogu94iUNj+ChDadg1Yzi8Kd/vZCITxjx6a1f5mwQdCHp31KCgkWW/BlkZA+M9rdCVOUg/r4/wK7tVxM7aYcu01I+vu1Xrh9VI+sdwrmgkwI8ej9BHkppGzj8z7/xJP4xOYJd6MewVImm9aIVW8ViBMsbiHXDNrqC3sI/lz9KEf4tFhQsMoKXQvg8Cp9p/OrR38Dm7qRGTt9S0wnN4+M4PxWSUosW9dUwLfcAAAqTSURBVCWGVX0gbyZNngaJ/2QQ6cVHcfizT3gS/1F5ALvk1G1je2UYv5N9uFmsw3rhXudYJvQauk/cvdZplpht+rcUyEV8ufc5SJ8avmBEmjlfwA0qnFY2VOPHK69VBZ68x1BcNXDSZM5ESOXz//UXnkEeInw28R3EkcbD8mVmEPp7HhAm2juRQPexF7NEqcO/JQOJ/Rd6YC16mfMHPGvH1vOHKH5QE2aGoAEUcGY/kDtJUUA9j9gKjuHg/f+G5IDHTH+etjGzeUUM8l27ByOY3qM4x2CaOwwwJzt/lsv9KwjRMFKRryO96RcTsXsV1LHVzD2qHaQ8Am3aQI+HCjupiINUhJ4yPhHhG8g9JzBfnMU4HrB34gyK2virWDDN55QB5lP/e8GOPw/4h7glmwYsc2aQ4/eGKhylgVPk65NKcCaN0yYOUhWF2r4UDjz4AJKDMxN/ZQEtF6QGHrL3eKqMOcAkA1CfeKnPT8QvVfq3lDCa38SGIc0g4jZt2rSB5v/5Vds29+yRvqdVT5a+Hj9PbevUq6dKt/NL7KwUhUXYiQncjMa5gEPzzGxgybYkR5nCv8WCU8nt7dytQ0YfjVlXtfpLVT8hBY30zqJO7aAtjYJj+40I8k82LhGLcaXwZqIyMMEErTMZ4LFSfoNYd6qUpys5qCtZtKzkyZtctkXVxbqiV0FOVPNQ5vDgA8WFd92kwDEZxg1iNbuBXphjJpig9ZwwAImyuz/bjKOHq0t1yjmB0XktjMBlavIWjZ+hnTpJt1MG0afUl9L5xWf13OwAsvjphyTBB8XFngGhX8ojc2UYTmcAHQ/oKcXZicOj4yY++ZELKp4JxPr1QPsS3rJNOlvL0L90sCQt2l6BHnpGYAnRiA8a7kzgGIYldhF7MkfFZlcElWR7OMf/XVBMsKRd7zqiunVL1atHhF2C6ZNMMmME7ajNyQQ/sF8uZbBoCo2zGaAkaoBi3w4WDBOs2wgsbdEthfGSNmrSKs+GIwEcEBPcIja4fp7iBKQOSoQpNJ7CAFo0FL4vSgZIXNEFZ2KhMAE2rIPVXl/yYg4vOyBbvxOjeBmGZBD+Uc7asH48U/zDoyh0Vmogm7MdVDITRHqW4vQD1+HgHbfipY98t+QpXa94gNuzyuUiUgJplkbhNNq6bh7d0233FrtryEzuS03IwufvP4hVa2LFnL4kiB1pw/jupQj/YTUiu0sTzp0JD9gvTpOMZCDeIi5y/STlB3pdcnRkT9xlXFrMJfRt3m5My4x5JaRpnvxXPY7lxH45mPO4IwnKyQTJ/nom9HjPUoSfXQ0rEijL92aCxPtZOZUBWAJ4bFhwq3ERvmI/P834IyYiVXBVjkCSB1x3gPWSAI26TqCgWCaJpwftnXm9dy4lgTUeUATXqzx51mNP4DKCFgalf7Pxd8ZWNgDdQMb0Q3LPtCPkLdxlbHWNMnqARMmKzduNaelJVwlAb+zptu8rtFLIS/+7odSSgMT66LOrWZ+XS6wXArYDpq81fmbtwp0BSGpciU48l2X8kVQgr8BLfbjgPjfiY4bGkPsK3T20t8DywtkwAYn1TIKXS6yTfbMfA4hJJZrzLe+i4yvQME2v0zO7Ct7i/PWii78zWxWQRKFYgpuLmYVwrg3AXVWAg55u+9OFSIF/sp/J961TkI86cMT6qDbcyi3WiQBkmGUbctBJn1uMDZ6i3MFTso8t+UwQY3zKuCrn57zUBzHUh4wZd/j5zObtxqe9Ds5UlXif3nFyRo8gM/hTKLwkAa1uZ5XHDrsPiCwXdsp+V+JD+/Rk+7xOdPGK9cJKNOB3WceIsch2ysU85C2skG7SI8zPPYcU6Jtp+/+cDKBtAVIDP8/1PnBoc3ZlhcQE3/ziGnzsrT4mOFnrlYT9cubh0rS66X03G+tcCcqEchG4tMK97AAHxFhuBiFJlQ95M8A9XrrfwYx1yZu3G4/1dNtPz9Q8ks8DygaJTjKOKFJGXB486sOpBwo+TUWBpARJg7eK1a6umpsdwNIzh+SAZp5LsHh6hbG3FHiaaDfTs8m3MP32mXYU8xKPmSB9RwRfgUb+PZPOrCTQA+4twMv5lTzCi+Jdxrop7prbedwCPm5wDMJsPIdTbuFm182is5HXfAAdP/5Mrvd4WcHE8aQbKe9Nxg65LrQyFhLxoZM1bshl/RNhqdgzk2grPZyqfGwoYqQVLp8nFZKVMv5MdszfCzm9gGzk2liSbvIpbeGSOF+pV/l8dr/QQ3G6cdxAejff66NzUWQuG5S8ISMu21fPBj0Tei99n5u3NJMB6cArOJShcqZsDDkTCqXOTbqefBobUhKDfuYSmask0+g8i8iEX06qKO/cueZ9WlUkmolIXivdqe/LLs4YRpzLu9ajBQ/LfZ7fTav0K/L5iW6g7JB5PnYAtApplNOvY5c8SwwQLnT7v4IkAJQUIN3yvYI+lAPsBskIRpDgh4ksguarH0sFIjJl49wMOPLFswmX6Ys7Vb0z5UPcGInwWePavO7CLZ5A+KhxxZ3Xbq/+ZiGPomAGgGIC8i0/ksdbc4JEJ5U8zVNrVE4QkW4WF0yxrvMN5BADFNPyRXZSHpE9V3V0oWjZ/aUdmzx6371R1JCozduNe0pRP0gPsxKJD/2QSdc+lUFwNwOOrj97NZOIp2SNm8GWC/uRW3I4IObMLDNrRXWsGOJjllPCrteRpqLhiPlKBjEpiX4itFew5ox0Dw+TaiDjLF9Ds5BoqiMp6hFIXyTaPIYdzYyiTXQdJbxJtxgVNWSqSQQL8q0zoYyywMR5HF+bHnZ7xurwEqmO7XEG45yQyaW36dh3ZQ8T1E1/kyojI9ANZEuQN/SofWDGWIljwObDMPR9O3FWbhJtt/3DjlVFL8SibIBM9HTbW4plgmyjyRGZ1YIqadVqa/IgdKlB10KFFm7GlQPnu91Efj6pWS/jLRN0nnxmBsSRHt0mj9/xiR1rHpnNo5g1A2CSCXbN+kQVABLDj8qDBdXi55mVY5C0eNje53n+fOMB5Hlv3m7Muq2/JJNC9YV8oBTnmm+QyijGgMsXFGeg83sVfjblJ+E+UArio1QSwMFs1EElIt/+PCImBYMKBUmbTC+DVN8MqoQMputLRXyUmgHwKmQCKr2aKcybr96eJUpOfMzFsGh9gbN2ESsFtLKJwLmSXWUgft9cEB9zIQEc6MribV7Jo4UGx0sglUAGHDEEEf6GAvz8Yh+lJv6czHOcMwZwUKqw8Z8p7tdR1znDnO8XoG/gA3M1iu5VirC29OeU+CiHBHBAe9XrztRXhUqYQ5DIvynfgo7ZomwM4KDQUvM/M+Qs4Z4LlJ0BMCkNvj/X+xQsIFDR7e3lWvWZmBcGcKCTSfcV24n8KkCfLt0u6YCuQjCvDIBJd/GeQtvQFjicdi3Pnr1yYd4ZwMGfCSNUDOEdVAwDONCMcLtmhFeLanBatL5fKYR3UHEMkAltIxAz3Fg5V1UQHtdEnzcdPxMqmgEcaK/BYYZKjyP0aA/nsfmw6gvFgmCATGQww00V5EY+rYNcC4LomVhwDJCNnm77ep19pJ8tZTAgw7o5hhJd2+Zi0no5seAZIBtaQqzQDNGomQIFModDZAL9JsONCN270FZ4TgD4/7j3Ohg7S/jCAAAAAElFTkSuQmCC"/>
      </defs>
    </svg>
  );
}
