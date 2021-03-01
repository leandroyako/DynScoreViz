\version "2.22.0"
\language "english"

\include "/home/yako/.local/share/SuperCollider/Extensions/fosc/stylesheets/default.ily"

\score {
    \new Score <<
        \new Staff {
            c''16
            -\staccato
            c''16
            -\accent
            g''16
            -\marcato
            f''16
            -\nil
            g''16
            -\staccato
            f'16
            -\accent
            a''16
            -\marcato
            d''16
            -\nil
            b'16
            -\staccato
            f''16
            -\accent
            f'16
            -\marcato
            a''16
            -\nil
            f''16
            -\staccato
            d'16
            -\accent
            d''16
            -\marcato
            f'16
            -\nil
        }
    >>
}