import type { FormEvent, RefObject } from "react";

type UsernameSceneProps = {
  username: string;
  rememberMe: boolean;
  usernameError: boolean;
  formBannerError?: string | null;
  usernameInputRef: RefObject<HTMLInputElement | null>;
  onUsernameChange: (value: string) => void;
  onRememberMeChange: (checked: boolean) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  isSubmitting?: boolean;
};

export function UsernameScene({
  username,
  rememberMe,
  usernameError,
  formBannerError = null,
  usernameInputRef,
  onUsernameChange,
  onRememberMeChange,
  onSubmit,
  isSubmitting = false,
}: UsernameSceneProps) {
  return (
    <div className="login-scene username-scene" data-scene="username">
      <div className="siw-main-view identify primary-auth">
        <div className="siw-main-header">
          <div />
        </div>
        <div className="siw-main-body">
          <form
            className={`ion-form o-form o-form-edit-mode${usernameError ? " o-form-has-errors" : ""}`}
            data-se="o-form"
            id="username-form"
            noValidate
            onSubmit={onSubmit}
          >
            <div
              data-se="o-form-content"
              className="o-form-content o-form-theme clearfix"
            >
              <h2 className="pds-u-sr-only">Log in to your account</h2>
              <h2 data-se="o-form-head" className="principal-form-head o-form-head">
                Log in to your account
              </h2>

              <div
                className="o-form-error-container"
                data-se="o-form-error-container"
                role="alert"
              >
                {formBannerError ? (
                  <p className="lh1-error" role="alert">
                    {formBannerError}
                  </p>
                ) : null}
              </div>

              <div
                className="o-form-fieldset-container"
                data-se="o-form-fieldset-container"
              >
                <div
                  data-se="o-form-fieldset-identifier"
                  className="o-form-fieldset o-form-label-top"
                >
                  <div
                    data-se="o-form-label"
                    className="okta-form-label o-form-label"
                  >
                    <label htmlFor="input-username">Username</label>
                  </div>
                  <div
                    data-se="o-form-input-container"
                    className="o-form-input"
                  >
                    <span
                      data-se="o-form-input-identifier"
                      className="o-form-input-name-identifier o-form-control okta-form-input-field input-fix"
                    >
                      <input
                        ref={usernameInputRef}
                        type="text"
                        placeholder=""
                        name="identifier"
                        id="input-username"
                        value={username}
                        autoComplete="username"
                        className={usernameError ? "has-input-error" : undefined}
                        onChange={(event) => onUsernameChange(event.target.value)}
                      />
                    </span>
                    {usernameError ? (
                      <p
                        id="username-error"
                        className="okta-form-input-error o-form-input-error o-form-explain"
                        role="alert"
                      >
                        <span className="error-16" />
                        This field cannot be left blank
                      </p>
                    ) : null}
                  </div>
                </div>

                <div
                  data-se="o-form-fieldset-rememberMe"
                  className="o-form-fieldset o-form-label-top"
                >
                  <div
                    data-se="o-form-input-container"
                    className="o-form-input"
                  >
                    <span
                      data-se="o-form-input-rememberMe"
                      className="o-form-input-name-rememberMe"
                    >
                      <div className="remember-device-field">
                        <input
                          type="checkbox"
                          name="rememberMe"
                          id="input-remember"
                          checked={rememberMe}
                          onChange={(event) =>
                            onRememberMeChange(event.target.checked)
                          }
                        />
                        <label htmlFor="input-remember" data-se-for-name="rememberMe">
                          Remember this device
                        </label>
                      </div>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="o-form-button-bar">
              <input
                className="button button-primary"
                type="submit"
                value={isSubmitting ? "Next…" : "Next"}
                data-type="save"
                disabled={isSubmitting}
              />
            </div>
          </form>
        </div>

        <div className="siw-main-footer">
          <div className="auth-footer auth-footer--stacked">
            <a
              href="https://credentials.principal.com/recovery?exitUrl=https%3A%2F%2Faccounts.principal.com%2Fapp%2Fbookmark%2F0oadm2qe1orihoKba5d7%2Flogin"
              data-se="custom"
              className="link js-forgot-credentials"
            >
              Forgot username or password?
            </a>
            <a
              href="https://www.principal.com/create-account"
              data-se="custom"
              className="link js-register"
            >
              New user? Register here.
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
