import type { FormEvent, KeyboardEvent, MouseEvent, RefObject } from "react";

type PasswordSceneProps = {
  username: string;
  password: string;
  showPassword: boolean;
  passwordInputRef: RefObject<HTMLInputElement | null>;
  onPasswordChange: (value: string) => void;
  onTogglePassword: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCancel: (event: MouseEvent<HTMLAnchorElement>) => void;
  passwordError?: string | null;
  isSubmitting?: boolean;
};

export function PasswordScene({
  username,
  password,
  showPassword,
  passwordInputRef,
  onPasswordChange,
  onTogglePassword,
  onSubmit,
  onCancel,
  passwordError,
  isSubmitting = false,
}: PasswordSceneProps) {
  const handleToggleKeyDown = (event: KeyboardEvent<HTMLSpanElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onTogglePassword();
    }
  };

  return (
    <div className="login-scene" data-scene="password">
      <div className="siw-main-view challenge-authenticator--okta_password">
        <div className="siw-main-header">
          <div />
        </div>
        <div className="siw-main-body">
          <form
            className="ion-form o-form o-form-edit-mode"
            data-se="o-form"
            id="password-form"
            noValidate
            onSubmit={onSubmit}
          >
            <div
              data-se="o-form-content"
              className="o-form-content o-form-theme clearfix"
            >
              <h2 className="pds-u-sr-only">Enter your password</h2>
              <h2 data-se="o-form-head" className="principal-form-head o-form-head">
                Enter your password
              </h2>

              <div className="identifier-container">
                <span
                  className="identifier no-translate"
                  data-se="identifier"
                  id="user-identifier"
                >
                  {username}
                </span>
              </div>

              <div
                className="o-form-error-container"
                data-se="o-form-error-container"
                role="alert"
              >
                {passwordError ? (
                  <p className="lh1-error" role="alert">
                    {passwordError}
                  </p>
                ) : null}
              </div>

              <div
                className="o-form-fieldset-container"
                data-se="o-form-fieldset-container"
              >
                <div
                  data-se="o-form-fieldset-credentials.passcode"
                  className="o-form-fieldset o-form-label-top"
                >
                  <div
                    data-se="o-form-label"
                    className="okta-form-label o-form-label"
                  >
                    <label htmlFor="input-password">Password</label>
                  </div>
                  <div
                    data-se="o-form-input-container"
                    className="o-form-input"
                  >
                    <span
                      data-se="o-form-input-credentials.passcode"
                      className="o-form-input-name-credentials.passcode o-form-control okta-form-input-field input-fix"
                    >
                      <input
                        ref={passwordInputRef}
                        type={showPassword ? "text" : "password"}
                        placeholder=""
                        name="credentials.passcode"
                        id="input-password"
                        value={password}
                        autoComplete="current-password"
                        className="password-with-toggle"
                        onChange={(event) => onPasswordChange(event.target.value)}
                      />
                      <span className="password-toggle">
                        <span
                          className={
                            showPassword
                              ? "eyeicon visibility-off-16 button-hide"
                              : "eyeicon visibility-16 button-show"
                          }
                          role="button"
                          tabIndex={0}
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                          onClick={onTogglePassword}
                          onKeyDown={handleToggleKeyDown}
                        />
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="o-form-button-bar">
              <input
                className="button button-primary"
                type="submit"
                value={isSubmitting ? "Verifying…" : "Verify"}
                data-type="save"
                disabled={isSubmitting}
              />
            </div>
          </form>
        </div>

        <div className="siw-main-footer">
          <div className="auth-footer auth-footer--stacked">
            <a
              href="#"
              data-se="cancel"
              className="link js-cancel"
              id="password-cancel"
              onClick={onCancel}
            >
              Cancel
            </a>
            <a
              href="https://credentials.principal.com/recovery"
              data-se="forgot-password"
              className="link js-forgot-password"
            >
              Forgot password?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
